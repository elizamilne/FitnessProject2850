package org.fitnessapp.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import org.fitnessapp.models.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction

@Serializable
data class CreateProgramRequest(
    val title: String,
    val bannerUrl: String?,
    val profileId: Long
)

@Serializable
data class ProgramResponse(
    val id: Long,
    val title: String,
    val bannerUrl: String?,
    val profileId: Long,
    val weeklyFrequency: Int
)

private fun findProgramsByProfileId(profileId: Long): List<ProgramResponse> = transaction {
    Program.selectAll()
        .where { Program.profileId eq profileId }
        .map { row ->
            val programId = row[Program.id]

            val frequency = ProgramSchedule.selectAll()
                .where { ProgramSchedule.programId eq programId }
                .count()
                .toInt()

            ProgramResponse(
                id = programId,
                title = row[Program.title],
                bannerUrl = row[Program.bannerUrl],
                profileId = row[Program.profileId],
                weeklyFrequency = frequency
            )
        }
}

fun Route.programRoutes() {
    route("/program") {

        post {
            val request = call.receive<CreateProgramRequest>()

            val existingProfile = transaction {
                Profile.selectAll()
                    .where { Profile.id eq request.profileId }
                    .singleOrNull()
            }

            if (existingProfile == null) {
                call.respond(HttpStatusCode.BadRequest, "Profile not found")
                return@post
            }

            val programId = transaction {
                Program.insert {
                    it[title] = request.title
                    it[bannerUrl] = request.bannerUrl
                    it[profileId] = request.profileId
                } get Program.id
            }

            call.respond(
                HttpStatusCode.Created,
                mapOf("id" to programId)
            )
        }

        get("/profile/{profileId}") {
            val profileId = call.parameters["profileId"]?.toLongOrNull()

            if (profileId == null) {
                call.respond(HttpStatusCode.BadRequest, "Invalid Profile ID")
                return@get
            }

            val programs = findProgramsByProfileId(profileId)

            call.respond(HttpStatusCode.OK, programs)
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()

            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, "Invalid ID")
                return@delete
            }

            val existingProgram = transaction {
                Program.selectAll()
                    .where { Program.id eq id }
                    .singleOrNull()
            }

            if (existingProgram == null) {
                call.respond(HttpStatusCode.NotFound, "Program not found")
                return@delete
            }

            transaction {
                val programExerciseIds = ProgramExercise.selectAll()
                    .where { ProgramExercise.programId eq id }
                    .map { it[ProgramExercise.id] }

                if (programExerciseIds.isNotEmpty()) {
                    ProgramExerciseMetric.deleteWhere { programExerciseId inList programExerciseIds }
                }

                ProgramExercise.deleteWhere { ProgramExercise.programId eq id }
                ProgramSchedule.deleteWhere { ProgramSchedule.programId eq id }
                Program.deleteWhere { Program.id eq id }
            }

            call.respond(HttpStatusCode.OK, "Program deleted")
        }
    }
}