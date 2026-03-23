package org.fitnessapp.services

import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

import org.fitnessapp.models.Category
import org.fitnessapp.models.CategoryDTO

fun ResultRow.toCategoryDTO() = CategoryDTO(
    id = this[Category.id],
    name = this[Category.name],
    image = this[Category.image]
)

object CategoryService {
    fun findAllCategories(): List<CategoryDTO> = transaction {
        Category.selectAll().map {
            it.toCategoryDTO()
        }
    }

    fun findCategoryById(id: Long): CategoryDTO? = transaction {
        Category.selectAll()
            .where { Category.id eq id }
            .map { it.toCategoryDTO() }
            .singleOrNull()
    }
}
