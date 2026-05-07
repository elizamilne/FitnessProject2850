package org.fitnessapp.services

import org.fitnessapp.models.CreateProgramExerciseRequest
import org.fitnessapp.models.Exercise
import org.fitnessapp.models.MetricType
import org.fitnessapp.models.Program
import org.fitnessapp.models.ProgramExercise
import org.fitnessapp.models.ProgramExerciseMetric
import org.fitnessapp.models.ProgramExerciseMetricRequest
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class ProgramExerciseServiceTest {

    @BeforeEach
    fun setup() {
        Database.connect(
            url = "jdbc:h2:mem:program_exercise_test;DB_CLOSE_DELAY=-1;",
            driver = "org.h2.Driver"
        )

        transaction {
            SchemaUtils.drop(
                ProgramExerciseMetric,
                ProgramExercise,
                MetricType,
                Exercise,
                Program
            )

            SchemaUtils.create(
                Program,
                Exercise,
                MetricType,
                ProgramExercise,
                ProgramExerciseMetric
            )

            // Allows testing without creating Profile / Program / Exercise parent rows first.
            exec("SET REFERENTIAL_INTEGRITY FALSE")
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

    private fun createProgramExercise(
        programId: Long = 1L,
        exerciseId: Long = 1L
    ): Long {
        return transaction {
            ProgramExerciseService.createProgramExerciseAndReturnId(
                CreateProgramExerciseRequest(
                    programId = programId,
                    exerciseId = exerciseId,
                    metrics = emptyList()
                )
            )
        }
    }

    @Test
    fun `createProgramExerciseAndReturnId creates program exercise and returns its id`() {
        val id = createProgramExercise(
            programId = 1L,
            exerciseId = 10L
        )

        val programExercises = ProgramExerciseService.findAllProgramExercises()

        assertEquals(1, programExercises.size)
        assertEquals(id, programExercises.first().id)
        assertEquals(1L, programExercises.first().programId)
        assertEquals(10L, programExercises.first().exerciseId)
    }

    @Test
    fun `findAllProgramExercises returns all program exercises`() {
        createProgramExercise(programId = 1L, exerciseId = 10L)
        createProgramExercise(programId = 1L, exerciseId = 20L)
        createProgramExercise(programId = 2L, exerciseId = 30L)

        val programExercises = ProgramExerciseService.findAllProgramExercises()

        assertEquals(3, programExercises.size)
        assertTrue(programExercises.any { it.programId == 1L && it.exerciseId == 10L })
        assertTrue(programExercises.any { it.programId == 1L && it.exerciseId == 20L })
        assertTrue(programExercises.any { it.programId == 2L && it.exerciseId == 30L })
    }

    @Test
    fun `getProgramExerciseIds returns ids for matching program only`() {
        val programOneExerciseId = createProgramExercise(programId = 1L, exerciseId = 10L)
        val anotherProgramOneExerciseId = createProgramExercise(programId = 1L, exerciseId = 20L)
        createProgramExercise(programId = 2L, exerciseId = 30L)

        val ids = transaction {
            ProgramExerciseService.getProgramExerciseIds(programId = 1L)
        }

        assertEquals(2, ids.size)
        assertTrue(ids.contains(programOneExerciseId))
        assertTrue(ids.contains(anotherProgramOneExerciseId))
    }

    @Test
    fun `getProgramExerciseIds returns empty list when program has no exercises`() {
        createProgramExercise(programId = 1L, exerciseId = 10L)

        val ids = transaction {
            ProgramExerciseService.getProgramExerciseIds(programId = 999L)
        }

        assertTrue(ids.isEmpty())
    }

    @Test
    fun `insertMetricIfTypeExists inserts metric when metric type exists`() {
        val programExerciseId = createProgramExercise()
        val metricTypeId = createMetricType(
            name = "Reps",
            unit = "reps"
        )

        transaction {
            ProgramExerciseService.insertMetricIfTypeExists(
                programExerciseId = programExerciseId,
                metric = ProgramExerciseMetricRequest(
                    metricTypeId = metricTypeId,
                    value = 12.0
                )
            )
        }

        val metrics = transaction {
            ProgramExerciseService.getMetricsForProgramExercise(programExerciseId)
        }

        assertEquals(1, metrics.size)
        assertEquals(metricTypeId, metrics.first().metricType.id)
        assertEquals("Reps", metrics.first().metricType.name)
        assertEquals("reps", metrics.first().metricType.unit)
        assertEquals(12.0, metrics.first().value)
    }

    @Test
    fun `insertMetricIfTypeExists does not insert metric when metric type does not exist`() {
        val programExerciseId = createProgramExercise()

        transaction {
            ProgramExerciseService.insertMetricIfTypeExists(
                programExerciseId = programExerciseId,
                metric = ProgramExerciseMetricRequest(
                    metricTypeId = 999L,
                    value = 50.0
                )
            )
        }

        val metrics = transaction {
            ProgramExerciseService.getMetricsForProgramExercise(programExerciseId)
        }

        assertTrue(metrics.isEmpty())
    }

    @Test
    fun `insertMetricsForProgramExercise inserts only metrics with existing metric types`() {
        val programExerciseId = createProgramExercise()

        val weightMetricTypeId = createMetricType(
            name = "Weight",
            unit = "kg"
        )

        val repsMetricTypeId = createMetricType(
            name = "Reps",
            unit = "reps"
        )

        transaction {
            ProgramExerciseService.insertMetricsForProgramExercise(
                programExerciseId = programExerciseId,
                metrics = listOf(
                    ProgramExerciseMetricRequest(
                        metricTypeId = weightMetricTypeId,
                        value = 80.0
                    ),
                    ProgramExerciseMetricRequest(
                        metricTypeId = repsMetricTypeId,
                        value = 10.0
                    ),
                    ProgramExerciseMetricRequest(
                        metricTypeId = 999L,
                        value = 123.0
                    )
                )
            )
        }

        val metrics = transaction {
            ProgramExerciseService.getMetricsForProgramExercise(programExerciseId)
        }

        assertEquals(2, metrics.size)
        assertTrue(metrics.any { it.metricType.name == "Weight" && it.value == 80.0 })
        assertTrue(metrics.any { it.metricType.name == "Reps" && it.value == 10.0 })
        assertTrue(metrics.none { it.value == 123.0 })
    }

    @Test
    fun `getMetricsForProgramExercise returns empty list when no metrics exist`() {
        val programExerciseId = createProgramExercise()

        val metrics = transaction {
            ProgramExerciseService.getMetricsForProgramExercise(programExerciseId)
        }

        assertTrue(metrics.isEmpty())
    }

    @Test
    fun `deleteProgramExerciseAndMetrics deletes program exercise`() {
        val programExerciseId = createProgramExercise()

        val deletedCount = ProgramExerciseService.deleteProgramExerciseAndMetrics(
            programExerciseId
        )

        val programExercises = ProgramExerciseService.findAllProgramExercises()

        assertEquals(1, deletedCount)
        assertTrue(programExercises.none { it.id == programExerciseId })
    }

    @Test
    fun `deleteProgramExerciseAndMetrics returns zero when program exercise does not exist`() {
        val deletedCount = ProgramExerciseService.deleteProgramExerciseAndMetrics(999L)

        assertEquals(0, deletedCount)
    }
}