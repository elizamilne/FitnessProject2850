package org.fitnessapp.routes

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.statements.UpdateBuilder
import org.jetbrains.exposed.sql.statements.InsertStatement

import org.fitnessapp.models.Race
import org.fitnessapp.models.RaceDTO
import org.fitnessapp.models.UpdateRaceRequest
import org.fitnessapp.models.CreateRaceRequest

import java.time.LocalDate

private fun ResultRow.toRaceDTO() = RaceDTO(
    id = this[Race.id],
    profileId = this[Race.profileId],
    title = this[Race.title],
    location = this[Race.location],
    date = this[Race.date].toString(),
    bannerUrl = this[Race.bannerUrl]
)

private fun updateRace(
    builder: UpdateBuilder<*>, 
    request: UpdateRaceRequest
) {
    builder[Race.title] = request.title
    builder[Race.location] = request.location
    builder[Race.date] = LocalDate.parse(request.date)
    builder[Race.bannerUrl] = request.bannerUrl
}

private fun createRace(
    builder: InsertStatement<*>,
    request: CreateRaceRequest
) {
    builder[Race.profileId] = request.profileId
    builder[Race.title] = request.title
    builder[Race.location] = request.location
    builder[Race.date] = LocalDate.parse(request.date)
    builder[Race.bannerUrl] = request.bannerUrl
}

private fun findRaceById(id: Long): RaceDTO? = transaction {
    Race
        .selectAll()
        .where { Race.id eq id }
        .map { it.toRaceDTO() }
        .singleOrNull()
}

fun Route.raceRoutes() {
    route("/races") {
        get {
            val races = transaction {
                Race.selectAll()
                    .map { it.toRaceDTO() }
            }
            
            call.respond(HttpStatusCode.OK, races)
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid id")
            
            val race = findRaceById(id)
                ?: return@get call.respond(HttpStatusCode.NotFound, "Race not found")
        
            call.respond(HttpStatusCode.OK, race)
        }

        post {
            val request = call.receive<CreateRaceRequest>()

            val raceId = transaction {
                Race.insert { builder ->
                    createRace(builder, request)
                } get Race.id
            }

            val createdRace = findRaceById(raceId)
                ?: return@post call.respond(HttpStatusCode.InternalServerError)
        
            call.respond(HttpStatusCode.Created, createdRace)
        }

        put("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@put call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val request = call.receive<UpdateRaceRequest>()
            
            val updated = transaction {
                Race.update({ Race.id eq id }) { builder ->
                    updateRace(builder, request)
                }
            }

            if (updated == 0) {
                return@put call.respond(HttpStatusCode.NotFound, "Race not found")
            }

            val updatedRace = findRaceById(id)
                ?: return@put call.respond(HttpStatusCode.InternalServerError)
            
            call.respond(HttpStatusCode.OK, updatedRace)
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, "Invalid Id")

            val deleted = transaction {
                Race.deleteWhere { Race.id eq id }
            }

            if (deleted == 0) {
                return@delete call.respond(HttpStatusCode.NotFound, "Race not found")
            }

            call.respond(HttpStatusCode.OK, mapOf("message" to "Deleted"))
        }
    }
}