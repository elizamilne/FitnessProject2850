package org.fitnessapp.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.fitnessapp.models.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDate

private fun findRaceById(id: Long): RaceResponse? = transaction {
    Race.selectAll()
        .where { Race.id eq id }
        .map {
            RaceResponse(
                id = it[Race.id],
                profileId = it[Race.profileId],
                title = it[Race.title],
                location = it[Race.location],
                date = it[Race.date].toString(),
                bannerUrl = it[Race.bannerUrl]
            )
        }
        .singleOrNull()
}

fun Route.raceRoutes() {
    route("/race") {

        post {
            val request = call.receive<CreateRaceRequest>()

            val raceId = transaction {
                Race.insert {
                    it[profileId] = request.profileId
                    it[title] = request.title
                    it[location] = request.location
                    it[date] = LocalDate.parse(request.date)
                    it[bannerUrl] = request.bannerUrl
                } get Race.id
            }

            val createdRace = findRaceById(raceId)
                ?: return@post call.respond(HttpStatusCode.InternalServerError)

            call.respond(HttpStatusCode.Created, createdRace)
        }

        get {
            val races = transaction {
                Race.selectAll().map {
                    RaceResponse(
                        id = it[Race.id],
                        profileId = it[Race.profileId],
                        title = it[Race.title],
                        location = it[Race.location],
                        date = it[Race.date].toString(),
                        bannerUrl = it[Race.bannerUrl]
                    )
                }
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

        put("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@put call.respond(HttpStatusCode.BadRequest, "Invalid id")

            val request = call.receive<UpdateRaceRequest>()

            val updated = transaction {
                Race.update({ Race.id eq id }) {
                    it[title] = request.title
                    it[location] = request.location
                    it[date] = LocalDate.parse(request.date)
                    it[bannerUrl] = request.bannerUrl
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
                ?: return@delete call.respond(HttpStatusCode.BadRequest, "Invalid id")

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