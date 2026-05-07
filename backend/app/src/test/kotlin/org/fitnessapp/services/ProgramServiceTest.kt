package org.fitnessapp.services

import org.fitnessapp.models.CreateProgramRequest
import org.fitnessapp.models.Program
import org.fitnessapp.models.ProgramSchedule
import org.fitnessapp.models.UpdateProgramRequest
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class ProgramServiceTest {

    @BeforeEach
    fun setup() {
        Database.connect(
            url = "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1;",
            driver = "org.h2.Driver"
        )

        transaction {
            SchemaUtils.drop(ProgramSchedule, Program)
            SchemaUtils.create(Program, ProgramSchedule)

            // Allows testing ProgramService without needing to create Profile rows first.
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

    private fun addScheduleDay(programId: Long, day: String) {
        transaction {
            ProgramSchedule.insert {
                it[ProgramSchedule.programId] = programId
                it[ProgramSchedule.day] = day
            }
        }
    }

    @Test
    fun `getDayOfWeek returns full English day name from date`() {
        val result = ProgramService.getDayOfWeek("2026-01-05")

        assertEquals("Monday", result)
    }

    @Test
    fun `getDayOfWeek returns null when date is null`() {
        val result = ProgramService.getDayOfWeek(null)

        assertNull(result)
    }

    @Test
    fun `createProgramAndReturnId creates a program and returns its id`() {
        val id = createProgram(
            profileId = 1L,
            title = "Strength Program",
            bannerUrl = "https://example.com/banner.jpg"
        )

        val program = requireNotNull(ProgramService.getProgramById(id))

        assertEquals(id, program.id)
        assertEquals(1L, program.profileId)
        assertEquals("Strength Program", program.title)
        assertEquals("https://example.com/banner.jpg", program.bannerUrl)
        assertFalse(program.archived)
        assertEquals(emptyList<String>(), program.weeklyFrequency)
    }

    @Test
    fun `getProgramById returns program with schedule days`() {
        val id = createProgram(title = "Running Program")

        addScheduleDay(id, "Monday")
        addScheduleDay(id, "Wednesday")

        val program = requireNotNull(ProgramService.getProgramById(id))

        assertEquals(id, program.id)
        assertEquals("Running Program", program.title)
        assertEquals(listOf("Monday", "Wednesday"), program.weeklyFrequency)
    }

    @Test
    fun `getProgramById returns null when program does not exist`() {
        val program = ProgramService.getProgramById(999L)

        assertNull(program)
    }

    @Test
    fun `findProgramRowById returns row when program exists`() {
        val id = createProgram(title = "Find Me")

        val row = requireNotNull(ProgramService.findProgramRowById(id))

        assertEquals(id, row[Program.id])
        assertEquals("Find Me", row[Program.title])
    }

    @Test
    fun `findProgramRowById returns null when program does not exist`() {
        val row = ProgramService.findProgramRowById(999L)

        assertNull(row)
    }

    @Test
    fun `getProgramsByProfileId returns programs for matching profile only`() {
        val programOneId = createProgram(profileId = 1L, title = "Program One")
        val programTwoId = createProgram(profileId = 1L, title = "Program Two")
        createProgram(profileId = 2L, title = "Other Profile Program")

        addScheduleDay(programOneId, "Monday")
        addScheduleDay(programTwoId, "Friday")

        val programs = ProgramService.getProgramsByProfileId(profileId = 1L)

        assertEquals(2, programs.size)
        assertTrue(programs.any { it.title == "Program One" && it.weeklyFrequency == listOf("Monday") })
        assertTrue(programs.any { it.title == "Program Two" && it.weeklyFrequency == listOf("Friday") })
        assertFalse(programs.any { it.title == "Other Profile Program" })
    }

    @Test
    fun `getProgramsByProfileIdAndDay returns programs matching day`() {
        val mondayProgramId = createProgram(profileId = 1L, title = "Monday Program")
        val fridayProgramId = createProgram(profileId = 1L, title = "Friday Program")
        val otherProfileProgramId = createProgram(profileId = 2L, title = "Other Profile Monday")

        addScheduleDay(mondayProgramId, "Monday")
        addScheduleDay(fridayProgramId, "Friday")
        addScheduleDay(otherProfileProgramId, "Monday")

        val programs = ProgramService.getProgramsByProfileIdAndDay(
            profileId = 1L,
            day = "Monday"
        )

        assertEquals(1, programs.size)
        assertEquals("Monday Program", programs.first().title)
        assertEquals(listOf("Monday"), programs.first().weeklyFrequency)
    }

    @Test
    fun `getProgramsByProfileIdAndDay returns empty list when no programs match day`() {
        val programId = createProgram(profileId = 1L, title = "Friday Program")

        addScheduleDay(programId, "Friday")

        val programs = ProgramService.getProgramsByProfileIdAndDay(
            profileId = 1L,
            day = "Monday"
        )

        assertTrue(programs.isEmpty())
    }

    @Test
    fun `getProgramsByProfileAndStatus returns archived and active programs`() {
        val activeProgramId = createProgram(profileId = 1L, title = "Active Program")
        val archivedProgramId = createProgram(profileId = 1L, title = "Archived Program")
        createProgram(profileId = 2L, title = "Other Profile Program")

        addScheduleDay(activeProgramId, "Tuesday")
        addScheduleDay(archivedProgramId, "Thursday")

        ProgramService.toggleArchiveProgram(archivedProgramId)

        val archivedPrograms = ProgramService.getProgramsByProfileAndStatus(
            profileId = 1L,
            archived = true
        )

        val activePrograms = ProgramService.getProgramsByProfileAndStatus(
            profileId = 1L,
            archived = false
        )

        assertEquals(1, archivedPrograms.size)
        assertEquals("Archived Program", archivedPrograms.first().title)
        assertTrue(archivedPrograms.first().archived)
        assertEquals(listOf("Thursday"), archivedPrograms.first().weeklyFrequency)

        assertEquals(1, activePrograms.size)
        assertEquals("Active Program", activePrograms.first().title)
        assertFalse(activePrograms.first().archived)
        assertEquals(listOf("Tuesday"), activePrograms.first().weeklyFrequency)
    }

    @Test
    fun `toggleArchiveProgram changes archived from false to true`() {
        val id = createProgram(title = "Archive Me")

        addScheduleDay(id, "Monday")

        val program = requireNotNull(ProgramService.toggleArchiveProgram(id))

        assertTrue(program.archived)
        assertEquals("Archive Me", program.title)
        assertEquals(listOf("Monday"), program.weeklyFrequency)

        val savedProgram = requireNotNull(ProgramService.getProgramById(id))

        assertTrue(savedProgram.archived)
    }

    @Test
    fun `toggleArchiveProgram changes archived from true to false`() {
        val id = createProgram(title = "Toggle Archive")

        ProgramService.toggleArchiveProgram(id)

        val program = requireNotNull(ProgramService.toggleArchiveProgram(id))

        assertFalse(program.archived)

        val savedProgram = requireNotNull(ProgramService.getProgramById(id))

        assertFalse(savedProgram.archived)
    }

    @Test
    fun `toggleArchiveProgram returns null when program does not exist`() {
        val program = ProgramService.toggleArchiveProgram(999L)

        assertNull(program)
    }

    @Test
    fun `updateProgram updates title and banner url`() {
        val id = createProgram(
            title = "Old Program",
            bannerUrl = ""
        )

        addScheduleDay(id, "Wednesday")

        val updatedProgram = requireNotNull(
            ProgramService.updateProgram(
                id,
                UpdateProgramRequest(
                    title = "New Program",
                    bannerUrl = "https://example.com/new-banner.jpg"
                )
            )
        )

        assertEquals(id, updatedProgram.id)
        assertEquals("New Program", updatedProgram.title)
        assertEquals("https://example.com/new-banner.jpg", updatedProgram.bannerUrl)
        assertEquals(listOf("Wednesday"), updatedProgram.weeklyFrequency)
    }

    @Test
    fun `updateProgram returns null when program does not exist`() {
        val updatedProgram = ProgramService.updateProgram(
            999L,
            UpdateProgramRequest(
                title = "Missing Program",
                bannerUrl = ""
            )
        )

        assertNull(updatedProgram)
    }

    @Test
    fun `deleteProgramById deletes program`() {
        val id = createProgram(title = "Delete Me")

        val deletedCount = ProgramService.deleteProgramById(id)

        assertEquals(1, deletedCount)
        assertNull(ProgramService.getProgramById(id))
    }

    @Test
    fun `deleteProgramById returns zero when program does not exist`() {
        val deletedCount = ProgramService.deleteProgramById(999L)

        assertEquals(0, deletedCount)
    }
}