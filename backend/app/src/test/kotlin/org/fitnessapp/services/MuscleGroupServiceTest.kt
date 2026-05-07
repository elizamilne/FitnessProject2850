package org.fitnessapp.services

import org.fitnessapp.models.MuscleGroup
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class MuscleGroupServiceTest {

    @BeforeEach
    fun setup() {
        Database.connect(
            url = "jdbc:h2:mem:muscle_group_test;DB_CLOSE_DELAY=-1;",
            driver = "org.h2.Driver"
        )

        transaction {
            SchemaUtils.drop(MuscleGroup)
            SchemaUtils.create(MuscleGroup)
        }
    }

    private fun createMuscleGroup(name: String): Long {
        return transaction {
            MuscleGroup.insert {
                it[MuscleGroup.name] = name
            } get MuscleGroup.id
        }
    }

    @Test
    fun `findAllMuscleGroups returns all muscle groups`() {
        createMuscleGroup("Chest")
        createMuscleGroup("Back")
        createMuscleGroup("Legs")

        val muscleGroups = MuscleGroupService.findAllMuscleGroups()

        assertEquals(3, muscleGroups.size)
        assertTrue(muscleGroups.any { it.name == "Chest" })
        assertTrue(muscleGroups.any { it.name == "Back" })
        assertTrue(muscleGroups.any { it.name == "Legs" })
    }

    @Test
    fun `findAllMuscleGroups returns empty list when there are no muscle groups`() {
        val muscleGroups = MuscleGroupService.findAllMuscleGroups()

        assertTrue(muscleGroups.isEmpty())
    }

    @Test
    fun `findMuscleGroupById returns muscle group when it exists`() {
        val id = createMuscleGroup("Shoulders")

        val muscleGroup = requireNotNull(
            MuscleGroupService.findMuscleGroupById(id)
        )

        assertEquals(id, muscleGroup.id)
        assertEquals("Shoulders", muscleGroup.name)
    }

    @Test
    fun `findMuscleGroupById returns null when muscle group does not exist`() {
        val muscleGroup = MuscleGroupService.findMuscleGroupById(999L)

        assertNull(muscleGroup)
    }

    @Test
    fun `toMuscleGroupDTO converts result row to dto`() {
        val id = createMuscleGroup("Arms")

        val muscleGroup = requireNotNull(
            MuscleGroupService.findMuscleGroupById(id)
        )

        assertEquals(id, muscleGroup.id)
        assertEquals("Arms", muscleGroup.name)
    }
}