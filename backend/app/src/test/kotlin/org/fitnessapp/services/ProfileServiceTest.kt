package org.fitnessapp.services

import org.fitnessapp.models.CreateProfileRequest
import org.fitnessapp.models.CreateUserRequest
import org.fitnessapp.models.Profile
import org.fitnessapp.models.User
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class ProfileServiceTest {

    @BeforeEach
    fun setup() {
        Database.connect(
            url = "jdbc:h2:mem:profile_test;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1;NON_KEYWORDS=USER",
            driver = "org.h2.Driver"
        )

        transaction {
            SchemaUtils.drop(Profile, User)
            SchemaUtils.create(User, Profile)
        }
    }

    private fun createUser(
        firstName: String = "Ivan",
        lastName: String = "Parvanovski",
        email: String = "ivan@example.com"
    ): Long {
        return UserService.createActivityAndReturnId(
            CreateUserRequest(
                firstName = firstName,
                lastName = lastName,
                email = email,
                hashPass = "hashed-password"
            )
        )
    }

    private fun createProfile(
        userId: Long = createUser(),
        goal: String = "Build muscle",
        gender: String = "Male",
        age: Int = 21,
        level: String = "Beginner",
        weight: Double = 75.5,
        height: Double = 180.0,
        workoutFrequency: Int = 4
    ): Long {
        return ProfileService.createProfileAndReturnId(
            CreateProfileRequest(
                userId = userId,
                goal = goal,
                gender = gender,
                age = age,
                level = level,
                weight = weight,
                height = height,
                workoutFrequency = workoutFrequency
            )
        )
    }

    @Test
    fun `createProfileAndReturnId creates a profile and returns its id`() {
        val userId = createUser()

        val profileId = createProfile(
            userId = userId,
            goal = "Lose weight",
            gender = "Male",
            age = 21,
            level = "Intermediate",
            weight = 82.5,
            height = 181.0,
            workoutFrequency = 5
        )

        val profile = requireNotNull(ProfileService.getProfileById(profileId))

        assertEquals(profileId, profile.id)
        assertEquals(userId, profile.userId)
        assertEquals("Lose weight", profile.goal)
        assertEquals("Male", profile.gender)
        assertEquals(21, profile.age)
        assertEquals("Intermediate", profile.level)
        assertEquals(82.5, profile.weight)
        assertEquals(181.0, profile.height)
        assertEquals(5, profile.workoutFrequency)
    }

    @Test
    fun `getProfileById returns null when profile does not exist`() {
        val profile = ProfileService.getProfileById(999L)

        assertNull(profile)
    }

    @Test
    fun `getProfileByUserId returns profile for matching user`() {
        val userId = createUser(email = "user1@example.com")
        val profileId = createProfile(userId = userId, goal = "Run faster")

        val profile = requireNotNull(ProfileService.getProfileByUserId(userId))

        assertEquals(profileId, profile.id)
        assertEquals(userId, profile.userId)
        assertEquals("Run faster", profile.goal)
    }

    @Test
    fun `getProfileByUserId returns null when user has no profile`() {
        val userId = createUser(email = "noprofile@example.com")

        val profile = ProfileService.getProfileByUserId(userId)

        assertNull(profile)
    }

    @Test
    fun `getAllProfiles returns all profiles`() {
        val userOneId = createUser(
            firstName = "Ivan",
            lastName = "Parvanovski",
            email = "ivan@example.com"
        )

        val userTwoId = createUser(
            firstName = "Alice",
            lastName = "Smith",
            email = "alice@example.com"
        )

        createProfile(userId = userOneId, goal = "Build muscle")
        createProfile(userId = userTwoId, goal = "Lose weight")

        val profiles = ProfileService.getAllProfiles()

        assertEquals(2, profiles.size)
        assertTrue(profiles.any { it.userId == userOneId && it.goal == "Build muscle" })
        assertTrue(profiles.any { it.userId == userTwoId && it.goal == "Lose weight" })
    }

    @Test
    fun `findProfileRowById returns row when profile exists`() {
        val userId = createUser()
        val profileId = createProfile(userId = userId, goal = "Get stronger")

        val row = requireNotNull(ProfileService.findProfileRowById(profileId))

        assertEquals(profileId, row[Profile.id])
        assertEquals(userId, row[Profile.userId])
        assertEquals("Get stronger", row[Profile.goal])
    }

    @Test
    fun `findProfileRowById returns null when profile does not exist`() {
        val row = ProfileService.findProfileRowById(999L)

        assertNull(row)
    }

    @Test
    fun `toProfileDTO converts result row to profile dto`() {
        val userId = createUser()
        val profileId = createProfile(
            userId = userId,
            goal = "Improve fitness",
            gender = "Male",
            age = 22,
            level = "Advanced",
            weight = 78.0,
            height = 182.0,
            workoutFrequency = 6
        )

        val row = requireNotNull(ProfileService.findProfileRowById(profileId))
        val dto = row.toProfileDTO()

        assertEquals(profileId, dto.id)
        assertEquals(userId, dto.userId)
        assertEquals("Improve fitness", dto.goal)
        assertEquals("Male", dto.gender)
        assertEquals(22, dto.age)
        assertEquals("Advanced", dto.level)
        assertEquals(78.0, dto.weight)
        assertEquals(182.0, dto.height)
        assertEquals(6, dto.workoutFrequency)
    }

    @Test
    fun `CreateProfileRequest toProfileDTO converts request to dto`() {
        val request = CreateProfileRequest(
            userId = 10L,
            goal = "Maintain fitness",
            gender = "Female",
            age = 25,
            level = "Beginner",
            weight = 65.0,
            height = 170.0,
            workoutFrequency = 3
        )

        val dto = request.toProfileDTO(id = 99L)

        assertEquals(99L, dto.id)
        assertEquals(10L, dto.userId)
        assertEquals("Maintain fitness", dto.goal)
        assertEquals("Female", dto.gender)
        assertEquals(25, dto.age)
        assertEquals("Beginner", dto.level)
        assertEquals(65.0, dto.weight)
        assertEquals(170.0, dto.height)
        assertEquals(3, dto.workoutFrequency)
    }

    @Test
    fun `searchProfiles returns matching profiles by first name`() {
        val currentUserId = createUser(
            firstName = "Current",
            lastName = "User",
            email = "current@example.com"
        )

        val currentProfileId = createProfile(userId = currentUserId)

        val targetUserId = createUser(
            firstName = "Alice",
            lastName = "Smith",
            email = "alice@example.com"
        )

        val targetProfileId = createProfile(userId = targetUserId)

        val results = ProfileService.searchProfiles(
            query = "Ali",
            currentProfileId = currentProfileId
        )

        assertEquals(1, results.size)
        assertEquals(targetProfileId, results.first().profileId)
        assertEquals(targetUserId, results.first().userId)
        assertEquals("Alice", results.first().firstName)
        assertEquals("Smith", results.first().lastName)
        assertEquals("alice@example.com", results.first().email)
    }

    @Test
    fun `searchProfiles returns matching profiles by last name`() {
        val currentUserId = createUser(
            firstName = "Current",
            lastName = "User",
            email = "current2@example.com"
        )

        val currentProfileId = createProfile(userId = currentUserId)

        val targetUserId = createUser(
            firstName = "Bob",
            lastName = "Johnson",
            email = "bob@example.com"
        )

        val targetProfileId = createProfile(userId = targetUserId)

        val results = ProfileService.searchProfiles(
            query = "John",
            currentProfileId = currentProfileId
        )

        assertEquals(1, results.size)
        assertEquals(targetProfileId, results.first().profileId)
        assertEquals("Bob", results.first().firstName)
        assertEquals("Johnson", results.first().lastName)
    }

    @Test
    fun `searchProfiles returns matching profiles by email`() {
        val currentUserId = createUser(
            firstName = "Current",
            lastName = "User",
            email = "current3@example.com"
        )

        val currentProfileId = createProfile(userId = currentUserId)

        val targetUserId = createUser(
            firstName = "Charlie",
            lastName = "Brown",
            email = "charlie.brown@example.com"
        )

        val targetProfileId = createProfile(userId = targetUserId)

        val results = ProfileService.searchProfiles(
            query = "charlie.brown",
            currentProfileId = currentProfileId
        )

        assertEquals(1, results.size)
        assertEquals(targetProfileId, results.first().profileId)
        assertEquals("charlie.brown@example.com", results.first().email)
    }

    @Test
    fun `searchProfiles excludes current profile`() {
        val currentUserId = createUser(
            firstName = "Ivan",
            lastName = "Current",
            email = "ivan.current@example.com"
        )

        val currentProfileId = createProfile(userId = currentUserId)

        val results = ProfileService.searchProfiles(
            query = "Ivan",
            currentProfileId = currentProfileId
        )

        assertTrue(results.isEmpty())
    }

    @Test
    fun `searchProfiles returns empty list when no profiles match`() {
        val currentUserId = createUser(
            firstName = "Current",
            lastName = "User",
            email = "current4@example.com"
        )

        val currentProfileId = createProfile(userId = currentUserId)

        createProfile(
            userId = createUser(
                firstName = "Alice",
                lastName = "Smith",
                email = "alice2@example.com"
            )
        )

        val results = ProfileService.searchProfiles(
            query = "DoesNotExist",
            currentProfileId = currentProfileId
        )

        assertTrue(results.isEmpty())
    }

    @Test
    fun `deleteProfileById deletes profile`() {
        val userId = createUser()
        val profileId = createProfile(userId = userId)

        val deletedCount = ProfileService.deleteProfileById(profileId)

        assertEquals(1, deletedCount)
        assertNull(ProfileService.getProfileById(profileId))
    }

    @Test
    fun `deleteProfileById returns zero when profile does not exist`() {
        val deletedCount = ProfileService.deleteProfileById(999L)

        assertEquals(0, deletedCount)
    }
}