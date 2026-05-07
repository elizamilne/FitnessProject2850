package org.fitnessapp.services

import org.fitnessapp.models.CreateProgramRequest
import org.fitnessapp.models.CreateProgramScheduleRequest
import org.fitnessapp.models.Program
import org.fitnessapp.models.ProgramSchedule
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class ProgramScheduleServiceTest {

    @BeforeEach
    fun setup() {
        Database.connect(
            url = "jdbc:h2:mem:program_schedule_test;DB_CLOSE_DELAY=-1;",
            driver = "org.h2.Driver"
        )

        transaction {
            SchemaUtils.drop(ProgramSchedule, Program)
            SchemaUtils.create(Program, ProgramSchedule)

            // Allows testing without creating Profile rows first.
            exec("SET REFERENTIAL_INTEGRITY FALSE")
        }
    }

    private fun createProgram(
        profileId: Long = 1L,
        title: String = "Strength Program",
        bannerUrl: String = ""
    ): Long {
        return ProgramService.createProgramAndReturnId(
            CreateProgramRequest(
                profileId = profileId,
                title = title,
                bannerUrl = bannerUrl
            )
        )
    }

    private fun createSchedule(
        programId: Long = createProgram(),
        day: String = "Monday"
    ): Long {
        return ProgramScheduleService.createProgramScheduleAndReturnId(
            CreateProgramScheduleRequest(
                programId = programId,
                day = day
            )
        )
    }

    @Test
    fun `createProgramScheduleAndReturnId creates schedule and returns its id`() {
        val programId = createProgram(title = "Running Program")

        val scheduleId = createSchedule(
            programId = programId,
            day = "Monday"
        )

        val schedule = requireNotNull(
            ProgramScheduleService.findScheduleById(scheduleId)
        )

        assertEquals(scheduleId, schedule.id)
        assertEquals(programId, schedule.programId)
        assertEquals("Monday", schedule.day)
    }

    @Test
    fun `findScheduleById returns schedule when it exists`() {
        val programId = createProgram()
        val scheduleId = createSchedule(programId = programId, day = "Tuesday")

        val schedule = requireNotNull(
            ProgramScheduleService.findScheduleById(scheduleId)
        )

        assertEquals(scheduleId, schedule.id)
        assertEquals(programId, schedule.programId)
        assertEquals("Tuesday", schedule.day)
    }

    @Test
    fun `findScheduleById returns null when schedule does not exist`() {
        val schedule = ProgramScheduleService.findScheduleById(999L)

        assertNull(schedule)
    }

    @Test
    fun `findSchedulesByProgramId returns all schedules for program`() {
        val programId = createProgram(title = "Weekly Program")

        createSchedule(programId = programId, day = "Monday")
        createSchedule(programId = programId, day = "Wednesday")
        createSchedule(programId = programId, day = "Friday")

        val schedules = ProgramScheduleService.findSchedulesByProgramId(programId)

        assertEquals(3, schedules.size)
        assertTrue(schedules.any { it.day == "Monday" && it.programId == programId })
        assertTrue(schedules.any { it.day == "Wednesday" && it.programId == programId })
        assertTrue(schedules.any { it.day == "Friday" && it.programId == programId })
    }

    @Test
    fun `findSchedulesByProgramId ignores schedules for other programs`() {
        val programOneId = createProgram(title = "Program One")
        val programTwoId = createProgram(title = "Program Two")

        createSchedule(programId = programOneId, day = "Monday")
        createSchedule(programId = programTwoId, day = "Tuesday")

        val schedules = ProgramScheduleService.findSchedulesByProgramId(programOneId)

        assertEquals(1, schedules.size)
        assertEquals("Monday", schedules.first().day)
        assertEquals(programOneId, schedules.first().programId)
    }

    @Test
    fun `findSchedulesByProgramId returns empty list when program has no schedules`() {
        val programId = createProgram(title = "Empty Program")

        val schedules = ProgramScheduleService.findSchedulesByProgramId(programId)

        assertTrue(schedules.isEmpty())
    }

    @Test
    fun `toProgramScheduleDTO converts result row to dto`() {
        val programId = createProgram()
        val scheduleId = createSchedule(programId = programId, day = "Thursday")

        val schedule = requireNotNull(
            ProgramScheduleService.findScheduleById(scheduleId)
        )

        assertEquals(scheduleId, schedule.id)
        assertEquals("Thursday", schedule.day)
        assertEquals(programId, schedule.programId)
    }

    @Test
    fun `deleteProgramScheduleById deletes schedule`() {
        val programId = createProgram()
        val scheduleId = createSchedule(programId = programId, day = "Saturday")

        val deletedCount = ProgramScheduleService.deleteProgramScheduleById(scheduleId)

        assertEquals(1, deletedCount)
        assertNull(ProgramScheduleService.findScheduleById(scheduleId))
    }

    @Test
    fun `deleteProgramScheduleById returns zero when schedule does not exist`() {
        val deletedCount = ProgramScheduleService.deleteProgramScheduleById(999L)

        assertEquals(0, deletedCount)
    }
}