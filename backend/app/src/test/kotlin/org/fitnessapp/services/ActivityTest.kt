package org.fitnessapp.services

import org.fitnessapp.models.Activity
import org.fitnessapp.models.ActivityMetric
import org.fitnessapp.models.CreateActivityMetricRequest
import org.fitnessapp.models.CreateActivityRequest
import org.fitnessapp.models.Exercise
import org.fitnessapp.models.MetricType
import org.fitnessapp.models.Profile
import org.fitnessapp.models.Program
import org.fitnessapp.models.ProgramExercise
import org.fitnessapp.models.User
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.time.LocalDate

class ActivityServiceTest {

    @BeforeEach
    fun setup() {
        Database.connect(
            url = "jdbc:h2:mem:activity_test;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1;NON_KEYWORDS=USER,UNIT",
            driver = "org.h2.Driver"
        )

        transaction {
            SchemaUtils.drop(
                ActivityMetric,
                Activity,
                ProgramExercise,
                MetricType,
                Exercise,
                Program,
                Profile,
                User
            )

            SchemaUtils.create(
                User,
                Profile,
                Program,
                Exercise,
                MetricType,
                ProgramExercise,
                Activity,
                ActivityMetric
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
        exerciseId: Long = createExercise()
    ): Long {
        return transaction {
            ProgramExercise.insert {
                it[ProgramExercise.programId] = programId
                it[ProgramExercise.exerciseId] = exerciseId
            } get ProgramExercise.id
        }
    }

    private fun createActivity(
        profileId: Long = 1L,
        programExerciseId: Long = createProgramExercise(),
        date: String = "2026-01-01"
    ): Long {
        return ActivityService.createActivityAndReturnId(
            CreateActivityRequest(
                profileId = profileId,
                programExerciseId = programExerciseId,
                date = date,
                metrics = emptyList()
            )
        )
    }

    @Test
    fun `createActivityAndReturnId creates activity and returns its id`() {
        val exerciseId = createExercise(
            name = "Squat",
            image = "squat.png"
        )

        val programExerciseId = createProgramExercise(
            programId = 1L,
            exerciseId = exerciseId
        )

        val activityId = createActivity(
            profileId = 10L,
            programExerciseId = programExerciseId,
            date = "2026-02-01"
        )

        val activity = requireNotNull(ActivityService.findActivityById(activityId))

        assertEquals(activityId, activity.id)
        assertEquals("2026-02-01", activity.date)
        assertEquals(10L, activity.profileId)
        assertEquals(programExerciseId, activity.programExerciseId)
        assertEquals("Squat", activity.exerciseName)
        assertTrue(activity.metrics.isEmpty())
    }

    @Test
    fun `findActivityById returns null when activity does not exist`() {
        val activity = ActivityService.findActivityById(999L)

        assertNull(activity)
    }

    @Test
    fun `findActivityById returns activity with metrics`() {
        val exerciseId = createExercise(
            name = "Bench Press",
            image = "bench.png"
        )

        val programExerciseId = createProgramExercise(
            exerciseId = exerciseId
        )

        val weightMetricId = createMetricType(
            name = "Weight",
            unit = "kg"
        )

        val repsMetricId = createMetricType(
            name = "Reps",
            unit = "reps"
        )

        val activityId = createActivity(
            profileId = 1L,
            programExerciseId = programExerciseId,
            date = "2026-03-01"
        )

        transaction {
            ActivityService.insertMetricsForActivity(
                activityId = activityId,
                metrics = listOf(
                    CreateActivityMetricRequest(
                        metricTypeId = weightMetricId,
                        value = 80.0
                    ),
                    CreateActivityMetricRequest(
                        metricTypeId = repsMetricId,
                        value = 10.0
                    )
                )
            )
        }

        val activity = requireNotNull(ActivityService.findActivityById(activityId))

        assertEquals(activityId, activity.id)
        assertEquals("Bench Press", activity.exerciseName)
        assertEquals(2, activity.metrics.size)
        assertTrue(activity.metrics.any { it.name == "Weight" && it.value == 80.0 && it.unit == "kg" })
        assertTrue(activity.metrics.any { it.name == "Reps" && it.value == 10.0 && it.unit == "reps" })
    }

    @Test
    fun `findActivitiesByProfile returns activities for matching profile`() {
        val benchExerciseId = createExercise(name = "Bench Press")
        val squatExerciseId = createExercise(name = "Squat")

        val benchProgramExerciseId = createProgramExercise(exerciseId = benchExerciseId)
        val squatProgramExerciseId = createProgramExercise(exerciseId = squatExerciseId)

        createActivity(
            profileId = 1L,
            programExerciseId = benchProgramExerciseId,
            date = "2026-01-01"
        )

        createActivity(
            profileId = 1L,
            programExerciseId = squatProgramExerciseId,
            date = "2026-01-02"
        )

        createActivity(
            profileId = 2L,
            programExerciseId = benchProgramExerciseId,
            date = "2026-01-03"
        )

        val response = ActivityService.findActivitiesByProfile(
            profileId = 1L,
            date = null
        )

        assertEquals(2L, response.totalElements)
        assertEquals(2, response.data.size)
        assertTrue(response.data.any { it.exerciseName == "Bench Press" })
        assertTrue(response.data.any { it.exerciseName == "Squat" })
    }

    @Test
    fun `findActivitiesByProfile filters by date`() {
        val exerciseId = createExercise(name = "Deadlift")
        val programExerciseId = createProgramExercise(exerciseId = exerciseId)

        createActivity(
            profileId = 1L,
            programExerciseId = programExerciseId,
            date = "2026-01-01"
        )

        createActivity(
            profileId = 1L,
            programExerciseId = programExerciseId,
            date = "2026-01-02"
        )

        val response = ActivityService.findActivitiesByProfile(
            profileId = 1L,
            date = LocalDate.parse("2026-01-02")
        )

        assertEquals(1L, response.totalElements)
        assertEquals(1, response.data.size)
        assertEquals("2026-01-02", response.data.first().date)
    }

    @Test
    fun `findActivitiesByProfile filters by search text`() {
        val benchExerciseId = createExercise(name = "Bench Press")
        val squatExerciseId = createExercise(name = "Squat")

        createActivity(
            profileId = 1L,
            programExerciseId = createProgramExercise(exerciseId = benchExerciseId),
            date = "2026-01-01"
        )

        createActivity(
            profileId = 1L,
            programExerciseId = createProgramExercise(exerciseId = squatExerciseId),
            date = "2026-01-02"
        )

        val response = ActivityService.findActivitiesByProfile(
            profileId = 1L,
            date = null,
            search = "bench"
        )

        assertEquals(1L, response.totalElements)
        assertEquals(1, response.data.size)
        assertEquals("Bench Press", response.data.first().exerciseName)
    }

    @Test
    fun `findActivitiesByProfile sorts ascending`() {
        val exerciseId = createExercise(name = "Running")
        val programExerciseId = createProgramExercise(exerciseId = exerciseId)

        createActivity(
            profileId = 1L,
            programExerciseId = programExerciseId,
            date = "2026-01-03"
        )

        createActivity(
            profileId = 1L,
            programExerciseId = programExerciseId,
            date = "2026-01-01"
        )

        createActivity(
            profileId = 1L,
            programExerciseId = programExerciseId,
            date = "2026-01-02"
        )

        val response = ActivityService.findActivitiesByProfile(
            profileId = 1L,
            date = null,
            sort = "asc"
        )

        assertEquals(3L, response.totalElements)
        assertEquals("2026-01-01", response.data[0].date)
        assertEquals("2026-01-02", response.data[1].date)
        assertEquals("2026-01-03", response.data[2].date)
    }

    @Test
    fun `findActivitiesByProfile paginates results`() {
        val exerciseId = createExercise(name = "Cycling")
        val programExerciseId = createProgramExercise(exerciseId = exerciseId)

        createActivity(
            profileId = 1L,
            programExerciseId = programExerciseId,
            date = "2026-01-01"
        )

        createActivity(
            profileId = 1L,
            programExerciseId = programExerciseId,
            date = "2026-01-02"
        )

        createActivity(
            profileId = 1L,
            programExerciseId = programExerciseId,
            date = "2026-01-03"
        )

        val response = ActivityService.findActivitiesByProfile(
            profileId = 1L,
            date = null,
            page = 2,
            limit = 1,
            sort = "asc"
        )

        assertEquals(3L, response.totalElements)
        assertEquals(1, response.data.size)
        assertEquals("2026-01-02", response.data.first().date)
    }

    @Test
    fun `getCompletedProgramExerciseIds returns distinct completed ids for date`() {
        val exerciseId = createExercise(name = "Push Up")
        val programExerciseOneId = createProgramExercise(exerciseId = exerciseId)
        val programExerciseTwoId = createProgramExercise(exerciseId = exerciseId)

        createActivity(
            profileId = 1L,
            programExerciseId = programExerciseOneId,
            date = "2026-01-01"
        )

        createActivity(
            profileId = 1L,
            programExerciseId = programExerciseOneId,
            date = "2026-01-01"
        )

        createActivity(
            profileId = 1L,
            programExerciseId = programExerciseTwoId,
            date = "2026-01-01"
        )

        createActivity(
            profileId = 1L,
            programExerciseId = programExerciseTwoId,
            date = "2026-01-02"
        )

        val ids = ActivityService.getCompletedProgramExerciseIds(
            profileId = 1L,
            date = LocalDate.parse("2026-01-01")
        )

        assertEquals(2, ids.size)
        assertTrue(ids.contains(programExerciseOneId))
        assertTrue(ids.contains(programExerciseTwoId))
    }

    @Test
    fun `insertMetricIfTypeExists inserts metric when type exists`() {
        val exerciseId = createExercise(name = "Bench Press")
        val programExerciseId = createProgramExercise(exerciseId = exerciseId)
        val activityId = createActivity(programExerciseId = programExerciseId)

        val metricTypeId = createMetricType(
            name = "Weight",
            unit = "kg"
        )

        transaction {
            ActivityService.insertMetricIfTypeExists(
                activityId = activityId,
                metric = CreateActivityMetricRequest(
                    metricTypeId = metricTypeId,
                    value = 100.0
                )
            )
        }

        val activity = requireNotNull(ActivityService.findActivityById(activityId))

        assertEquals(1, activity.metrics.size)
        assertEquals("Weight", activity.metrics.first().name)
        assertEquals(100.0, activity.metrics.first().value)
        assertEquals("kg", activity.metrics.first().unit)
    }

    @Test
    fun `insertMetricIfTypeExists does not insert metric when type does not exist`() {
        val exerciseId = createExercise(name = "Bench Press")
        val programExerciseId = createProgramExercise(exerciseId = exerciseId)
        val activityId = createActivity(programExerciseId = programExerciseId)

        transaction {
            ActivityService.insertMetricIfTypeExists(
                activityId = activityId,
                metric = CreateActivityMetricRequest(
                    metricTypeId = 999L,
                    value = 100.0
                )
            )
        }

        val activity = requireNotNull(ActivityService.findActivityById(activityId))

        assertTrue(activity.metrics.isEmpty())
    }

    @Test
    fun `getBestMetricsByProfile returns best metric values`() {
        val exerciseId = createExercise(name = "Bench Press")
        val programExerciseId = createProgramExercise(exerciseId = exerciseId)

        val weightMetricId = createMetricType(
            name = "Weight",
            unit = "kg"
        )

        val firstActivityId = createActivity(
            profileId = 1L,
            programExerciseId = programExerciseId,
            date = "2026-01-01"
        )

        val secondActivityId = createActivity(
            profileId = 1L,
            programExerciseId = programExerciseId,
            date = "2026-01-02"
        )

        transaction {
            ActivityService.insertMetricIfTypeExists(
                firstActivityId,
                CreateActivityMetricRequest(
                    metricTypeId = weightMetricId,
                    value = 80.0
                )
            )

            ActivityService.insertMetricIfTypeExists(
                secondActivityId,
                CreateActivityMetricRequest(
                    metricTypeId = weightMetricId,
                    value = 100.0
                )
            )
        }

        val bestMetrics = transaction {
            ActivityService.getBestMetricsByProfile(profileId = 1L)
        }

        assertEquals(1, bestMetrics.size)
        assertEquals(programExerciseId, bestMetrics.first().programExerciseId)
        assertEquals("Bench Press", bestMetrics.first().exerciseName)
        assertEquals(weightMetricId, bestMetrics.first().metricTypeId)
        assertEquals("Weight", bestMetrics.first().metricName)
        assertEquals("kg", bestMetrics.first().metricUnit)
        assertEquals(100.0, bestMetrics.first().bestValue)
    }

    @Test
    fun `deleteActivityById deletes activity`() {
        val exerciseId = createExercise(name = "Squat")
        val programExerciseId = createProgramExercise(exerciseId = exerciseId)

        val activityId = createActivity(
            profileId = 1L,
            programExerciseId = programExerciseId,
            date = "2026-01-01"
        )

        val deletedCount = ActivityService.deleteActivityById(activityId)

        assertEquals(1, deletedCount)
        assertNull(ActivityService.findActivityById(activityId))
    }

    @Test
    fun `deleteActivityById returns zero when activity does not exist`() {
        val deletedCount = ActivityService.deleteActivityById(999L)

        assertEquals(0, deletedCount)
    }

    @Test
    fun `deleteByProgramExercise deletes matching activity`() {
        val exerciseId = createExercise(name = "Squat")
        val programExerciseId = createProgramExercise(exerciseId = exerciseId)

        val matchingActivityId = createActivity(
            profileId = 1L,
            programExerciseId = programExerciseId,
            date = "2026-01-01"
        )

        createActivity(
            profileId = 1L,
            programExerciseId = programExerciseId,
            date = "2026-01-02"
        )

        val deletedCount = ActivityService.deleteByProgramExercise(
            profileId = 1L,
            programExerciseId = programExerciseId,
            date = LocalDate.parse("2026-01-01")
        )

        assertEquals(1, deletedCount)
        assertNull(ActivityService.findActivityById(matchingActivityId))
    }

    @Test
    fun `deleteByProgramExercise returns zero when no activity matches`() {
        val exerciseId = createExercise(name = "Squat")
        val programExerciseId = createProgramExercise(exerciseId = exerciseId)

        createActivity(
            profileId = 1L,
            programExerciseId = programExerciseId,
            date = "2026-01-01"
        )

        val deletedCount = ActivityService.deleteByProgramExercise(
            profileId = 2L,
            programExerciseId = programExerciseId,
            date = LocalDate.parse("2026-01-01")
        )

        assertEquals(0, deletedCount)
    }
}