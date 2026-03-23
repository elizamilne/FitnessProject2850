package org.fitnessapp.routes

import org.fitnessapp.services.CategoryService
import org.fitnessapp.services.toCategoryDTO

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

import org.fitnessapp.models.Category
import org.fitnessapp.models.CategoryDTO

fun Route.categoryRoutes() {
    route("/categories") {
        get {
            val categories = CategoryService.findAllCategories()
            
            call.respond(HttpStatusCode.OK, categories)
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val category = CategoryService.findCategoryById(id)

            if (category == null) {
                call.respond(HttpStatusCode.NotFound, "Category not found")
            } else {
                call.respond(HttpStatusCode.OK, category)
            }
        }
    }
}