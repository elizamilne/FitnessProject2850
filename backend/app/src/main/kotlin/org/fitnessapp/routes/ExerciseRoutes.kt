package org.fitnessapp.routes

import org.fitnessapp.services.ExerciseService

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.like

import org.fitnessapp.models.Exercise
import org.fitnessapp.models.ExerciseDTO
import org.fitnessapp.models.ExerciseDetailDTO

import org.fitnessapp.models.ExerciseCategory
import org.fitnessapp.models.ExerciseMuscleGroup

fun Route.exerciseRoutes() { 
    route("/exercises") {
        get {
            val search = call.request.queryParameters["search"]
            val categoryId = call.request.queryParameters["categoryId"]?.toLongOrNull()
            val muscleGroupId = call.request.queryParameters["muscleGroupId"]?.toLongOrNull()

            val exercises = ExerciseService.findExercises(search, categoryId, muscleGroupId)

            call.respond(HttpStatusCode.OK, exercises)
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")

            val result = ExerciseService.findExerciseDetailById(id)

            if (result == null) {
                call.respond(HttpStatusCode.NotFound, "Exercise not found")
            } else {
                call.respond(HttpStatusCode.OK, result)
            }
        }
    }
}