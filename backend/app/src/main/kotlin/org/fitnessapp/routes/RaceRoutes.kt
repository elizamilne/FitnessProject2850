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

import org.fitnessapp.services.RaceService
import org.fitnessapp.services.toRaceDTO

fun Route.raceRoutes() {
    route("/races") {
        get {
            val races = RaceService.getAllRaces()
            
            call.respond(HttpStatusCode.OK, races)
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid id")
            
            val race = RaceService.findRaceById(id)
                ?: return@get call.respond(HttpStatusCode.NotFound, "Race not found")
        
            call.respond(HttpStatusCode.OK, race)
        }

        post {
            val request = call.receive<CreateRaceRequest>()

            val raceId = RaceService.createRaceAndReturnId(request)
            
            val createdRace = RaceService.findRaceById(raceId)
                ?: return@post call.respond(HttpStatusCode.InternalServerError)
        
            call.respond(HttpStatusCode.Created, createdRace)
        }

        put("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@put call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val request = call.receive<UpdateRaceRequest>()
            
            val updatedCount = RaceService.updateRaceById(id, request)
            
            if (updatedCount == 0) {
                return@put call.respond(HttpStatusCode.NotFound, "Race not found")
            }

            val updatedRace = RaceService.findRaceById(id)
                ?: return@put call.respond(HttpStatusCode.InternalServerError)
            
            call.respond(HttpStatusCode.OK, updatedRace)
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, "Invalid Id")

            val deletedCount = RaceService.deleteRaceById(id)

            if (deletedCount == 0) {
                return@delete call.respond(HttpStatusCode.NotFound, "Race not found")
            }

            call.respond(HttpStatusCode.OK, mapOf("message" to "Deleted"))
        }
    }
}