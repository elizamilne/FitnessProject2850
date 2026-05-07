package org.fitnessapp.services

import org.fitnessapp.models.CreateRaceRequest
import org.fitnessapp.models.Race
import org.fitnessapp.models.UpdateRaceRequest
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class RaceServiceTest {

    @BeforeEach
    fun setup() {
        Database.connect(
            url = "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1;",
            driver = "org.h2.Driver"
        )

        transaction {
            SchemaUtils.drop(Race)
            SchemaUtils.create(Race)

            // Allows testing RaceService without needing to create Profile rows first.
            exec("SET REFERENTIAL_INTEGRITY FALSE")
        }
    }

    @Test
    fun `createRaceAndReturnId creates a race and returns its id`() {
        val request = CreateRaceRequest(
            profileId = 1L,
            title = "London Marathon",
            location = "London",
            date = "2026-04-26",
            bannerUrl = "https://example.com/banner.jpg"
        )

        val id = RaceService.createRaceAndReturnId(request)
        val race = requireNotNull(RaceService.findRaceById(id))

        assertEquals(id, race.id)
        assertEquals(1L, race.profileId)
        assertEquals("London Marathon", race.title)
        assertEquals("London", race.location)
        assertEquals("2026-04-26", race.date)
        assertEquals("https://example.com/banner.jpg", race.bannerUrl)
        assertFalse(race.completed)
    }

    @Test
    fun `findRaceById returns null when race does not exist`() {
        val race = RaceService.findRaceById(999L)

        assertNull(race)
    }

    @Test
    fun `getAllRaces returns all created races`() {
        RaceService.createRaceAndReturnId(
            CreateRaceRequest(
                profileId = 1L,
                title = "Race One",
                location = "London",
                date = "2026-01-01",
                bannerUrl = null
            )
        )

        RaceService.createRaceAndReturnId(
            CreateRaceRequest(
                profileId = 2L,
                title = "Race Two",
                location = "Paris",
                date = "2026-02-01",
                bannerUrl = null
            )
        )

        val races = RaceService.getAllRaces()

        assertEquals(2, races.size)
        assertTrue(races.any { it.title == "Race One" })
        assertTrue(races.any { it.title == "Race Two" })
    }

    @Test
    fun `updateRaceById updates race fields`() {
        val id = RaceService.createRaceAndReturnId(
            CreateRaceRequest(
                profileId = 1L,
                title = "Old Title",
                location = "Old Location",
                date = "2026-01-01",
                bannerUrl = null
            )
        )

        val updatedCount = RaceService.updateRaceById(
            id,
            UpdateRaceRequest(
                title = "New Title",
                location = "New Location",
                date = "2026-05-05",
                bannerUrl = "https://example.com/new-banner.jpg",
                completed = true
            )
        )

        val updatedRace = requireNotNull(RaceService.findRaceById(id))

        assertEquals(1, updatedCount)
        assertEquals("New Title", updatedRace.title)
        assertEquals("New Location", updatedRace.location)
        assertEquals("2026-05-05", updatedRace.date)
        assertEquals("https://example.com/new-banner.jpg", updatedRace.bannerUrl)
        assertTrue(updatedRace.completed)
    }

    @Test
    fun `updateRaceById returns zero when race does not exist`() {
        val updatedCount = RaceService.updateRaceById(
            999L,
            UpdateRaceRequest(
                title = "Does Not Exist",
                location = "Nowhere",
                date = "2026-01-01",
                bannerUrl = null,
                completed = false
            )
        )

        assertEquals(0, updatedCount)
    }

    @Test
    fun `deleteRaceById deletes race`() {
        val id = RaceService.createRaceAndReturnId(
            CreateRaceRequest(
                profileId = 1L,
                title = "Delete Me",
                location = "Berlin",
                date = "2026-06-01",
                bannerUrl = null
            )
        )

        val deletedCount = RaceService.deleteRaceById(id)

        assertEquals(1, deletedCount)
        assertNull(RaceService.findRaceById(id))
    }

    @Test
    fun `deleteRaceById returns zero when race does not exist`() {
        val deletedCount = RaceService.deleteRaceById(999L)

        assertEquals(0, deletedCount)
    }

    @Test
    fun `toggleRaceCompleted changes completed from false to true`() {
        val id = RaceService.createRaceAndReturnId(
            CreateRaceRequest(
                profileId = 1L,
                title = "Toggle Race",
                location = "Manchester",
                date = "2026-07-01",
                bannerUrl = null
            )
        )

        val toggledRace = requireNotNull(RaceService.toggleRaceCompleted(id))

        assertTrue(toggledRace.completed)

        val savedRace = requireNotNull(RaceService.findRaceById(id))

        assertTrue(savedRace.completed)
    }

    @Test
    fun `toggleRaceCompleted changes completed from true to false`() {
        val id = RaceService.createRaceAndReturnId(
            CreateRaceRequest(
                profileId = 1L,
                title = "Toggle Twice Race",
                location = "Manchester",
                date = "2026-07-01",
                bannerUrl = null
            )
        )

        RaceService.toggleRaceCompleted(id)

        val toggledAgainRace = requireNotNull(RaceService.toggleRaceCompleted(id))

        assertFalse(toggledAgainRace.completed)

        val savedRace = requireNotNull(RaceService.findRaceById(id))

        assertFalse(savedRace.completed)
    }

    @Test
    fun `toggleRaceCompleted returns null when race does not exist`() {
        val result = RaceService.toggleRaceCompleted(999L)

        assertNull(result)
    }

    @Test
    fun `getNextIncompleteRace returns earliest incomplete race for profile`() {
        RaceService.createRaceAndReturnId(
            CreateRaceRequest(
                profileId = 1L,
                title = "Later Race",
                location = "Paris",
                date = "2026-12-01",
                bannerUrl = null
            )
        )

        RaceService.createRaceAndReturnId(
            CreateRaceRequest(
                profileId = 1L,
                title = "Earlier Race",
                location = "Berlin",
                date = "2026-03-01",
                bannerUrl = null
            )
        )

        RaceService.createRaceAndReturnId(
            CreateRaceRequest(
                profileId = 2L,
                title = "Other Profile Race",
                location = "Rome",
                date = "2026-01-01",
                bannerUrl = null
            )
        )

        val nextRace = requireNotNull(RaceService.getNextIncompleteRace(profileId = 1L))

        assertEquals("Earlier Race", nextRace.title)
        assertEquals("2026-03-01", nextRace.date)
    }

    @Test
    fun `getNextIncompleteRace ignores completed races`() {
        val completedRaceId = RaceService.createRaceAndReturnId(
            CreateRaceRequest(
                profileId = 1L,
                title = "Completed Race",
                location = "London",
                date = "2026-01-01",
                bannerUrl = null
            )
        )

        RaceService.toggleRaceCompleted(completedRaceId)

        RaceService.createRaceAndReturnId(
            CreateRaceRequest(
                profileId = 1L,
                title = "Incomplete Race",
                location = "Madrid",
                date = "2026-02-01",
                bannerUrl = null
            )
        )

        val nextRace = requireNotNull(RaceService.getNextIncompleteRace(profileId = 1L))

        assertEquals("Incomplete Race", nextRace.title)
    }

    @Test
    fun `getNextIncompleteRace returns null when profile has no incomplete races`() {
        val id = RaceService.createRaceAndReturnId(
            CreateRaceRequest(
                profileId = 1L,
                title = "Only Completed Race",
                location = "London",
                date = "2026-01-01",
                bannerUrl = null
            )
        )

        RaceService.toggleRaceCompleted(id)

        val nextRace = RaceService.getNextIncompleteRace(profileId = 1L)

        assertNull(nextRace)
    }

    @Test
    fun `getProgramsByProfileAndCompletion returns races matching profile and completion`() {
        val incompleteRaceId = RaceService.createRaceAndReturnId(
            CreateRaceRequest(
                profileId = 1L,
                title = "Incomplete Race",
                location = "London",
                date = "2026-01-01",
                bannerUrl = null
            )
        )

        val completedRaceId = RaceService.createRaceAndReturnId(
            CreateRaceRequest(
                profileId = 1L,
                title = "Completed Race",
                location = "Paris",
                date = "2026-02-01",
                bannerUrl = null
            )
        )

        RaceService.createRaceAndReturnId(
            CreateRaceRequest(
                profileId = 2L,
                title = "Other Profile Race",
                location = "Berlin",
                date = "2026-03-01",
                bannerUrl = null
            )
        )

        RaceService.toggleRaceCompleted(completedRaceId)

        val incompleteRaces = RaceService.getProgramsByProfileAndCompletion(
            profileId = 1L,
            completed = false
        )

        val completedRaces = RaceService.getProgramsByProfileAndCompletion(
            profileId = 1L,
            completed = true
        )

        assertEquals(1, incompleteRaces.size)
        assertEquals(incompleteRaceId, incompleteRaces.first().id)
        assertEquals("Incomplete Race", incompleteRaces.first().title)

        assertEquals(1, completedRaces.size)
        assertEquals(completedRaceId, completedRaces.first().id)
        assertEquals("Completed Race", completedRaces.first().title)
    }
}