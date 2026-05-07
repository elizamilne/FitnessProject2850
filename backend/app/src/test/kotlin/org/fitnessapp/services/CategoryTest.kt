package org.fitnessapp.services

import org.fitnessapp.models.Category
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class CategoryServiceTest {

    @BeforeEach
    fun setup() {
        Database.connect(
            url = "jdbc:h2:mem:category_test;DB_CLOSE_DELAY=-1;",
            driver = "org.h2.Driver"
        )

        transaction {
            SchemaUtils.drop(Category)
            SchemaUtils.create(Category)
        }
    }

    private fun createCategory(
        name: String,
        image: String = ""
    ): Long {
        return transaction {
            Category.insert {
                it[Category.name] = name
                it[Category.image] = image
            } get Category.id
        }
    }

    @Test
    fun `findAllCategories returns all categories`() {
        createCategory(
            name = "Strength",
            image = "strength.png"
        )

        createCategory(
            name = "Cardio",
            image = "cardio.png"
        )

        createCategory(
            name = "Mobility",
            image = "mobility.png"
        )

        val categories = CategoryService.findAllCategories()

        assertEquals(3, categories.size)
        assertTrue(categories.any { it.name == "Strength" && it.image == "strength.png" })
        assertTrue(categories.any { it.name == "Cardio" && it.image == "cardio.png" })
        assertTrue(categories.any { it.name == "Mobility" && it.image == "mobility.png" })
    }

    @Test
    fun `findAllCategories returns empty list when there are no categories`() {
        val categories = CategoryService.findAllCategories()

        assertTrue(categories.isEmpty())
    }

    @Test
    fun `findCategoryById returns category when it exists`() {
        val id = createCategory(
            name = "Strength",
            image = "strength.png"
        )

        val category = requireNotNull(CategoryService.findCategoryById(id))

        assertEquals(id, category.id)
        assertEquals("Strength", category.name)
        assertEquals("strength.png", category.image)
    }

    @Test
    fun `findCategoryById returns null when category does not exist`() {
        val category = CategoryService.findCategoryById(999L)

        assertNull(category)
    }

    @Test
    fun `toCategoryDTO converts result row to dto`() {
        val id = createCategory(
            name = "Cardio",
            image = "cardio.png"
        )

        val category = requireNotNull(CategoryService.findCategoryById(id))

        assertEquals(id, category.id)
        assertEquals("Cardio", category.name)
        assertEquals("cardio.png", category.image)
    }
}