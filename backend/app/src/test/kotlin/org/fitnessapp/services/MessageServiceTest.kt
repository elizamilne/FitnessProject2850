package org.fitnessapp.services

import org.fitnessapp.models.CreateProfileRequest
import org.fitnessapp.models.CreateUserRequest
import org.fitnessapp.models.Message
import org.fitnessapp.models.Profile
import org.fitnessapp.models.User
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class MessageServiceTest {

    @BeforeEach
    fun setup() {
        Database.connect(
            url = "jdbc:h2:mem:message_test;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1;NON_KEYWORDS=USER",
            driver = "org.h2.Driver"
        )

        transaction {
            SchemaUtils.drop(Message, Profile, User)
            SchemaUtils.create(User, Profile, Message)

            // Allows testing MessageService without creating Conversation rows first.
            exec("SET REFERENTIAL_INTEGRITY FALSE")
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
        weight: Double = 75.0,
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
    fun `saveMessage saves message and returns message dto`() {
        val userId = createUser(
            firstName = "Ivan",
            lastName = "Parvanovski",
            email = "ivan.message@example.com"
        )

        val profileId = createProfile(userId = userId)

        val message = MessageService.saveMessage(
            profileId = profileId,
            conversationId = 1L,
            content = "Hello world"
        )

        assertEquals("Hello world", message.content)
        assertEquals(profileId, message.profileId)
        assertEquals("Ivan Parvanovski", message.senderName)
        assertTrue(message.createdAt.isNotBlank())
    }

    @Test
    fun `getMessages returns messages for conversation`() {
        val userId = createUser(
            firstName = "Alice",
            lastName = "Smith",
            email = "alice.message@example.com"
        )

        val profileId = createProfile(userId = userId)

        MessageService.saveMessage(
            profileId = profileId,
            conversationId = 10L,
            content = "First message"
        )

        MessageService.saveMessage(
            profileId = profileId,
            conversationId = 10L,
            content = "Second message"
        )

        val messages = MessageService.getMessages(conversationId = 10L)

        assertEquals(2, messages.size)
        assertEquals("First message", messages[0].content)
        assertEquals("Second message", messages[1].content)
        assertTrue(messages.all { it.profileId == profileId })
        assertTrue(messages.all { it.senderName == "Alice Smith" })
    }

    @Test
    fun `getMessages ignores messages from other conversations`() {
        val userId = createUser(
            firstName = "Bob",
            lastName = "Jones",
            email = "bob.message@example.com"
        )

        val profileId = createProfile(userId = userId)

        MessageService.saveMessage(
            profileId = profileId,
            conversationId = 1L,
            content = "Correct conversation"
        )

        MessageService.saveMessage(
            profileId = profileId,
            conversationId = 2L,
            content = "Wrong conversation"
        )

        val messages = MessageService.getMessages(conversationId = 1L)

        assertEquals(1, messages.size)
        assertEquals("Correct conversation", messages.first().content)
    }

    @Test
    fun `getMessages returns empty list when conversation has no messages`() {
        val messages = MessageService.getMessages(conversationId = 999L)

        assertTrue(messages.isEmpty())
    }

    @Test
    fun `getMessages includes correct sender name for each profile`() {
        val userOneId = createUser(
            firstName = "Ivan",
            lastName = "Parvanovski",
            email = "ivan.sender@example.com"
        )

        val profileOneId = createProfile(userId = userOneId)

        val userTwoId = createUser(
            firstName = "Alice",
            lastName = "Smith",
            email = "alice.sender@example.com"
        )

        val profileTwoId = createProfile(userId = userTwoId)

        MessageService.saveMessage(
            profileId = profileOneId,
            conversationId = 20L,
            content = "Message from Ivan"
        )

        MessageService.saveMessage(
            profileId = profileTwoId,
            conversationId = 20L,
            content = "Message from Alice"
        )

        val messages = MessageService.getMessages(conversationId = 20L)

        assertEquals(2, messages.size)
        assertTrue(messages.any { it.content == "Message from Ivan" && it.senderName == "Ivan Parvanovski" })
        assertTrue(messages.any { it.content == "Message from Alice" && it.senderName == "Alice Smith" })
    }
}