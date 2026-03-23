package org.fitnessapp.routes

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

private fun ResultRow.toCategoryDTO() = CategoryDTO(
    id = this[Category.id],
    name = this[Category.name],
    image = this[Category.image]
)

private fun findAllCategories(): List<CategoryDTO> = transaction {
    Category.selectAll().map {
        it.toCategoryDTO()
    }
}

private fun findCategoryById(id: Long): CategoryDTO? = transaction {
    Category.selectAll()
        .where { Category.id eq id }
        .map { it.toCategoryDTO() }
        .singleOrNull()
}

fun Route.categoryRoutes() {
    route("/categories") {
        get {
            val categories = findAllCategories()
            
            call.respond(HttpStatusCode.OK, categories)
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val category = findCategoryById(id)

            if (category == null) {
                call.respond(HttpStatusCode.NotFound, "Category not found")
            } else {
                call.respond(HttpStatusCode.OK, category)
            }
        }
    }
}