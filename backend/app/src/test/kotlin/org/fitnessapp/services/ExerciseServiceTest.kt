package org.fitnessapp.services

import org.fitnessapp.models.Category
import org.fitnessapp.models.Exercise
import org.fitnessapp.models.ExerciseCategory
import org.fitnessapp.models.ExerciseMetricTypes
import org.fitnessapp.models.ExerciseMuscleGroup
import org.fitnessapp.models.MetricType
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

class ExerciseServiceTest {

    @BeforeEach
    fun setup() {
        Database.connect(
            url = "jdbc:h2:mem:exercise_test;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1;NON_KEYWORDS=UNIT",
            driver = "org.h2.Driver"
        )

        transaction {
            SchemaUtils.drop(
                ExerciseMetricTypes,
                ExerciseMuscleGroup,
                ExerciseCategory,
                MetricType,
                MuscleGroup,
                Category,
                Exercise
            )

            SchemaUtils.create(
                Exercise,
                Category,
                MuscleGroup,
                MetricType,
                ExerciseCategory,
                ExerciseMuscleGroup,
                ExerciseMetricTypes
            )

            exec("SET REFERENTIAL_INTEGRITY FALSE")
        }
    }

    private fun createExercise(
        name: String = "Bench Press",
        image: String = "bench.png"
    ): Long {
        return transaction {
            Exercise.insert {
                it[Exercise.name] = name
                it[Exercise.image] = image
            } get Exercise.id
        }
    }

    private fun createCategory(
        name: String = "Strength"
    ): Long {
        return transaction {
            Category.insert {
                it[Category.name] = name
            } get Category.id
        }
    }

    private fun createMuscleGroup(
        name: String = "Chest"
    ): Long {
        return transaction {
            MuscleGroup.insert {
                it[MuscleGroup.name] = name
            } get MuscleGroup.id
        }
    }

    private fun createMetricType(
        name: String = "Weight",
        unit: String = "kg"
    ): Long {
        return transaction {
            MetricType.insert {
                it[MetricType.name] = name
                it[MetricType.unit] = unit
            } get MetricType.id
        }
    }

    private fun linkExerciseToCategory(
        exerciseId: Long,
        categoryId: Long
    ) {
        transaction {
            ExerciseCategory.insert {
                it[ExerciseCategory.exerciseId] = exerciseId
                it[ExerciseCategory.categoryId] = categoryId
            }
        }
    }

    private fun linkExerciseToMuscleGroup(
        exerciseId: Long,
        muscleGroupId: Long
    ) {
        transaction {
            ExerciseMuscleGroup.insert {
                it[ExerciseMuscleGroup.exerciseId] = exerciseId
                it[ExerciseMuscleGroup.muscleGroupId] = muscleGroupId
            }
        }
    }

    private fun linkExerciseToMetricType(
        exerciseId: Long,
        metricTypeId: Long
    ) {
        transaction {
            ExerciseMetricTypes.insert {
                it[ExerciseMetricTypes.exerciseId] = exerciseId
                it[ExerciseMetricTypes.metricTypeId] = metricTypeId
            }
        }
    }

    @Test
    fun `findExerciseById returns row when exercise exists`() {
        val exerciseId = createExercise(
            name = "Squat",
            image = "squat.png"
        )

        val row = requireNotNull(ExerciseService.findExerciseById(exerciseId))

        assertEquals(exerciseId, row[Exercise.id])
        assertEquals("Squat", row[Exercise.name])
        assertEquals("squat.png", row[Exercise.image])
    }

    @Test
    fun `findExerciseById returns null when exercise does not exist`() {
        val row = ExerciseService.findExerciseById(999L)

        assertNull(row)
    }

    @Test
    fun `findExerciseDetailById returns exercise with category and muscle group ids`() {
        val exerciseId = createExercise(
            name = "Bench Press",
            image = "bench.png"
        )

        val categoryId = createCategory("Strength")
        val muscleGroupId = createMuscleGroup("Chest")

        linkExerciseToCategory(exerciseId, categoryId)
        linkExerciseToMuscleGroup(exerciseId, muscleGroupId)

        val exercise = requireNotNull(
            ExerciseService.findExerciseDetailById(exerciseId)
        )

        assertEquals(exerciseId, exercise.id)
        assertEquals("Bench Press", exercise.name)
        assertEquals("bench.png", exercise.image)
        assertEquals(listOf(categoryId), exercise.categoryIds)
        assertEquals(listOf(muscleGroupId), exercise.muscleGroupIds)
    }

    @Test
    fun `findExerciseDetailById returns null when exercise does not exist`() {
        val exercise = ExerciseService.findExerciseDetailById(999L)

        assertNull(exercise)
    }

    @Test
    fun `findExerciseIdsByCategoryId returns matching exercise ids`() {
        val exerciseOneId = createExercise(name = "Bench Press")
        val exerciseTwoId = createExercise(name = "Squat")
        val otherExerciseId = createExercise(name = "Running")

        val strengthCategoryId = createCategory("Strength")
        val cardioCategoryId = createCategory("Cardio")

        linkExerciseToCategory(exerciseOneId, strengthCategoryId)
        linkExerciseToCategory(exerciseTwoId, strengthCategoryId)
        linkExerciseToCategory(otherExerciseId, cardioCategoryId)

        val ids = transaction {
            ExerciseService.findExerciseIdsByCategoryId(strengthCategoryId)
        }

        assertEquals(2, ids.size)
        assertTrue(ids.contains(exerciseOneId))
        assertTrue(ids.contains(exerciseTwoId))
    }

    @Test
    fun `findExerciseIdsByMuscleGroupId returns matching exercise ids`() {
        val exerciseOneId = createExercise(name = "Bench Press")
        val exerciseTwoId = createExercise(name = "Push Up")
        val otherExerciseId = createExercise(name = "Squat")

        val chestId = createMuscleGroup("Chest")
        val legsId = createMuscleGroup("Legs")

        linkExerciseToMuscleGroup(exerciseOneId, chestId)
        linkExerciseToMuscleGroup(exerciseTwoId, chestId)
        linkExerciseToMuscleGroup(otherExerciseId, legsId)

        val ids = transaction {
            ExerciseService.findExerciseIdsByMuscleGroupId(chestId)
        }

        assertEquals(2, ids.size)
        assertTrue(ids.contains(exerciseOneId))
        assertTrue(ids.contains(exerciseTwoId))
    }

    @Test
    fun `findCategoryIdsByExerciseId returns category ids for exercise`() {
        val exerciseId = createExercise(name = "Bench Press")
        val strengthId = createCategory("Strength")
        val upperBodyId = createCategory("Upper Body")

        linkExerciseToCategory(exerciseId, strengthId)
        linkExerciseToCategory(exerciseId, upperBodyId)

        val categoryIds = transaction {
            ExerciseService.findCategoryIdsByExerciseId(exerciseId)
        }

        assertEquals(2, categoryIds.size)
        assertTrue(categoryIds.contains(strengthId))
        assertTrue(categoryIds.contains(upperBodyId))
    }

    @Test
    fun `findMuscleGroupIdsByExerciseId returns muscle group ids for exercise`() {
        val exerciseId = createExercise(name = "Bench Press")
        val chestId = createMuscleGroup("Chest")
        val tricepsId = createMuscleGroup("Triceps")

        linkExerciseToMuscleGroup(exerciseId, chestId)
        linkExerciseToMuscleGroup(exerciseId, tricepsId)

        val muscleGroupIds = transaction {
            ExerciseService.findMuscleGroupIdsByExerciseId(exerciseId)
        }

        assertEquals(2, muscleGroupIds.size)
        assertTrue(muscleGroupIds.contains(chestId))
        assertTrue(muscleGroupIds.contains(tricepsId))
    }

    @Test
    fun `findExercises returns all exercises with categories and muscle groups`() {
        val exerciseId = createExercise(
            name = "Bench Press",
            image = "bench.png"
        )

        val categoryId = createCategory("Strength")
        val muscleGroupId = createMuscleGroup("Chest")

        linkExerciseToCategory(exerciseId, categoryId)
        linkExerciseToMuscleGroup(exerciseId, muscleGroupId)

        val exercises = ExerciseService.findExercises(
            search = null,
            categoryId = null,
            muscleGroupId = null
        )

        assertEquals(1, exercises.size)
        assertEquals(exerciseId, exercises.first().exercise.id)
        assertEquals("Bench Press", exercises.first().exercise.name)
        assertEquals("Strength", exercises.first().categories.first().name)
        assertEquals("Chest", exercises.first().muscleGroups.first().name)
    }

    @Test
    fun `findExercises filters by search text case insensitive`() {
        createExercise(name = "Bench Press")
        createExercise(name = "Squat")

        val exercises = ExerciseService.findExercises(
            search = "bench",
            categoryId = null,
            muscleGroupId = null
        )

        assertEquals(1, exercises.size)
        assertEquals("Bench Press", exercises.first().exercise.name)
    }

    @Test
    fun `findExercises filters by category id`() {
        val benchId = createExercise(name = "Bench Press")
        createExercise(name = "Running")

        val strengthId = createCategory("Strength")
        val cardioId = createCategory("Cardio")

        linkExerciseToCategory(benchId, strengthId)

        val runningId = requireNotNull(
            ExerciseService.findExercises(
                search = "Running",
                categoryId = null,
                muscleGroupId = null
            ).first().exercise.id
        )

        linkExerciseToCategory(runningId, cardioId)

        val exercises = ExerciseService.findExercises(
            search = null,
            categoryId = strengthId,
            muscleGroupId = null
        )

        assertEquals(1, exercises.size)
        assertEquals("Bench Press", exercises.first().exercise.name)
    }

    @Test
    fun `findExercises filters by muscle group id`() {
        val benchId = createExercise(name = "Bench Press")
        val squatId = createExercise(name = "Squat")

        val chestId = createMuscleGroup("Chest")
        val legsId = createMuscleGroup("Legs")

        linkExerciseToMuscleGroup(benchId, chestId)
        linkExerciseToMuscleGroup(squatId, legsId)

        val exercises = ExerciseService.findExercises(
            search = null,
            categoryId = null,
            muscleGroupId = chestId
        )

        assertEquals(1, exercises.size)
        assertEquals("Bench Press", exercises.first().exercise.name)
    }

    @Test
    fun `findExercises returns empty list when category has no exercises`() {
        createExercise(name = "Bench Press")
        val categoryId = createCategory("Unused Category")

        val exercises = ExerciseService.findExercises(
            search = null,
            categoryId = categoryId,
            muscleGroupId = null
        )

        assertTrue(exercises.isEmpty())
    }

    @Test
    fun `findExercises returns empty list when muscle group has no exercises`() {
        createExercise(name = "Bench Press")
        val muscleGroupId = createMuscleGroup("Unused Muscle")

        val exercises = ExerciseService.findExercises(
            search = null,
            categoryId = null,
            muscleGroupId = muscleGroupId
        )

        assertTrue(exercises.isEmpty())
    }

    @Test
    fun `findExerciseFullById returns exercise with categories and muscle groups`() {
        val exerciseId = createExercise(
            name = "Deadlift",
            image = "deadlift.png"
        )

        val categoryId = createCategory("Strength")
        val muscleGroupId = createMuscleGroup("Back")

        linkExerciseToCategory(exerciseId, categoryId)
        linkExerciseToMuscleGroup(exerciseId, muscleGroupId)

        val exercise = requireNotNull(
            ExerciseService.findExerciseFullById(exerciseId)
        )

        assertEquals(exerciseId, exercise.exercise.id)
        assertEquals("Deadlift", exercise.exercise.name)
        assertEquals("Strength", exercise.categories.first().name)
        assertEquals("Back", exercise.muscleGroups.first().name)
    }

    @Test
    fun `findExerciseFullById returns null when exercise does not exist`() {
        val exercise = ExerciseService.findExerciseFullById(999L)

        assertNull(exercise)
    }

    @Test
    fun `findMetricsForExercise returns exercise with metric types`() {
        val exerciseId = createExercise(
            name = "Bench Press",
            image = "bench.png"
        )

        val weightMetricId = createMetricType(
            name = "Weight",
            unit = "kg"
        )

        val repsMetricId = createMetricType(
            name = "Reps",
            unit = "reps"
        )

        linkExerciseToMetricType(exerciseId, weightMetricId)
        linkExerciseToMetricType(exerciseId, repsMetricId)

        val result = requireNotNull(
            ExerciseService.findMetricsForExercise(exerciseId)
        )

        assertEquals(exerciseId, result.exerciseId)
        assertEquals("Bench Press", result.exerciseName)
        assertEquals(2, result.metrics.size)
        assertTrue(result.metrics.any { it.name == "Weight" && it.unit == "kg" })
        assertTrue(result.metrics.any { it.name == "Reps" && it.unit == "reps" })
    }

    @Test
    fun `findMetricsForExercise returns null when exercise has no metrics`() {
        val exerciseId = createExercise(name = "Squat")

        val result = ExerciseService.findMetricsForExercise(exerciseId)

        assertNull(result)
    }
}