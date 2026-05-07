package org.fitnessapp.services

import org.fitnessapp.models.Conversation
import org.fitnessapp.models.ConversationParticipant
import org.fitnessapp.models.CreateProfileRequest
import org.fitnessapp.models.CreateUserRequest
import org.fitnessapp.models.Profile
import org.fitnessapp.models.User
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class ConversationServiceTest {

    @BeforeEach
    fun setup() {
        Database.connect(
            url = "jdbc:h2:mem:conversation_test;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1;NON_KEYWORDS=USER",
            driver = "org.h2.Driver"
        )

        transaction {
            SchemaUtils.drop(
                ConversationParticipant,
                Conversation,
                Profile,
                User
            )

            SchemaUtils.create(
                User,
                Profile,
                Conversation,
                ConversationParticipant
            )
        }
    }

    private fun createUser(
        firstName: String,
        lastName: String,
        email: String
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
        userId: Long,
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

    private fun createProfileWithUser(
        firstName: String,
        lastName: String,
        email: String
    ): Long {
        val userId = createUser(
            firstName = firstName,
            lastName = lastName,
            email = email
        )

        return createProfile(userId = userId)
    }

    private fun addParticipant(
        conversationId: Long,
        profileId: Long
    ) {
        transaction {
            ConversationParticipant.insert {
                it[ConversationParticipant.conversationId] = conversationId
                it[ConversationParticipant.profileId] = profileId
            }
        }
    }

    @Test
    fun `createConversation creates private conversation by default`() {
        val conversationId = ConversationService.createConversation()

        val conversation = transaction {
            Conversation
                .selectAll()
                .where { Conversation.id eq conversationId }
                .single()
        }

        assertEquals(conversationId, conversation[Conversation.id])
        assertEquals(false, conversation[Conversation.isGroup])
    }

    @Test
    fun `createConversation creates group conversation when requested`() {
        val conversationId = ConversationService.createConversation(isGroup = true)

        val conversation = transaction {
            Conversation
                .selectAll()
                .where { Conversation.id eq conversationId }
                .single()
        }

        assertEquals(conversationId, conversation[Conversation.id])
        assertEquals(true, conversation[Conversation.isGroup])
    }

    @Test
    fun `getUserConversation returns other participant name for private chat`() {
        val ivanProfileId = createProfileWithUser(
            firstName = "Ivan",
            lastName = "Parvanovski",
            email = "ivan.conversation@example.com"
        )

        val aliceProfileId = createProfileWithUser(
            firstName = "Alice",
            lastName = "Smith",
            email = "alice.conversation@example.com"
        )

        val conversationId = ConversationService.createConversation(isGroup = false)

        addParticipant(conversationId, ivanProfileId)
        addParticipant(conversationId, aliceProfileId)

        val conversation = ConversationService.getUserConversation(
            profileId = ivanProfileId,
            conversationId = conversationId
        )

        assertEquals(conversationId, conversation.conversationId)
        assertEquals("Alice Smith", conversation.name)
        assertEquals(false, conversation.isGroup)
    }

    @Test
    fun `getUserConversation returns group name for group conversation`() {
        val profileId = createProfileWithUser(
            firstName = "Ivan",
            lastName = "Parvanovski",
            email = "ivan.group@example.com"
        )

        val conversationId = ConversationService.createConversation(isGroup = true)

        addParticipant(conversationId, profileId)

        val conversation = ConversationService.getUserConversation(
            profileId = profileId,
            conversationId = conversationId
        )

        assertEquals(conversationId, conversation.conversationId)
        assertEquals("Group #$conversationId", conversation.name)
        assertEquals(true, conversation.isGroup)
    }

    @Test
    fun `getUserConversation returns unknown user when private chat has no other participant`() {
        val profileId = createProfileWithUser(
            firstName = "Solo",
            lastName = "User",
            email = "solo@example.com"
        )

        val conversationId = ConversationService.createConversation(isGroup = false)

        addParticipant(conversationId, profileId)

        val conversation = ConversationService.getUserConversation(
            profileId = profileId,
            conversationId = conversationId
        )

        assertEquals(conversationId, conversation.conversationId)
        assertEquals("Unknown user", conversation.name)
        assertEquals(false, conversation.isGroup)
    }

    @Test
    fun `getUserConversation throws when conversation is not accessible`() {
        val profileId = createProfileWithUser(
            firstName = "Ivan",
            lastName = "Parvanovski",
            email = "ivan.notaccessible@example.com"
        )

        val conversationId = ConversationService.createConversation(isGroup = false)

        val exception = assertThrows(IllegalArgumentException::class.java) {
            ConversationService.getUserConversation(
                profileId = profileId,
                conversationId = conversationId
            )
        }

        assertEquals("Conversation not found or not accessible", exception.message)
    }

    @Test
    fun `getUserConversations returns all conversations for profile`() {
        val ivanProfileId = createProfileWithUser(
            firstName = "Ivan",
            lastName = "Parvanovski",
            email = "ivan.all@example.com"
        )

        val aliceProfileId = createProfileWithUser(
            firstName = "Alice",
            lastName = "Smith",
            email = "alice.all@example.com"
        )

        val privateConversationId = ConversationService.createConversation(isGroup = false)
        val groupConversationId = ConversationService.createConversation(isGroup = true)

        addParticipant(privateConversationId, ivanProfileId)
        addParticipant(privateConversationId, aliceProfileId)

        addParticipant(groupConversationId, ivanProfileId)
        addParticipant(groupConversationId, aliceProfileId)

        val conversations = ConversationService.getUserConversations(
            profileId = ivanProfileId,
            type = null
        )

        assertEquals(2, conversations.size)
        assertTrue(conversations.any { it.conversationId == privateConversationId && it.name == "Alice Smith" && !it.isGroup })
        assertTrue(conversations.any { it.conversationId == groupConversationId && it.name == "Group #$groupConversationId" && it.isGroup })
    }

    @Test
    fun `getUserConversations filters group conversations`() {
        val ivanProfileId = createProfileWithUser(
            firstName = "Ivan",
            lastName = "Parvanovski",
            email = "ivan.groups@example.com"
        )

        val aliceProfileId = createProfileWithUser(
            firstName = "Alice",
            lastName = "Smith",
            email = "alice.groups@example.com"
        )

        val privateConversationId = ConversationService.createConversation(isGroup = false)
        val groupConversationId = ConversationService.createConversation(isGroup = true)

        addParticipant(privateConversationId, ivanProfileId)
        addParticipant(privateConversationId, aliceProfileId)

        addParticipant(groupConversationId, ivanProfileId)
        addParticipant(groupConversationId, aliceProfileId)

        val conversations = ConversationService.getUserConversations(
            profileId = ivanProfileId,
            type = "group"
        )

        assertEquals(1, conversations.size)
        assertEquals(groupConversationId, conversations.first().conversationId)
        assertEquals(true, conversations.first().isGroup)
    }

    @Test
    fun `getUserConversations filters private chats`() {
        val ivanProfileId = createProfileWithUser(
            firstName = "Ivan",
            lastName = "Parvanovski",
            email = "ivan.chats@example.com"
        )

        val aliceProfileId = createProfileWithUser(
            firstName = "Alice",
            lastName = "Smith",
            email = "alice.chats@example.com"
        )

        val privateConversationId = ConversationService.createConversation(isGroup = false)
        val groupConversationId = ConversationService.createConversation(isGroup = true)

        addParticipant(privateConversationId, ivanProfileId)
        addParticipant(privateConversationId, aliceProfileId)

        addParticipant(groupConversationId, ivanProfileId)
        addParticipant(groupConversationId, aliceProfileId)

        val conversations = ConversationService.getUserConversations(
            profileId = ivanProfileId,
            type = "chat"
        )

        assertEquals(1, conversations.size)
        assertEquals(privateConversationId, conversations.first().conversationId)
        assertEquals(false, conversations.first().isGroup)
        assertEquals("Alice Smith", conversations.first().name)
    }

    @Test
    fun `getUserConversations returns empty list when profile has no conversations`() {
        val profileId = createProfileWithUser(
            firstName = "No",
            lastName = "Conversations",
            email = "none@example.com"
        )

        val conversations = ConversationService.getUserConversations(
            profileId = profileId,
            type = null
        )

        assertTrue(conversations.isEmpty())
    }

    @Test
    fun `findPrivateConversation returns matching private conversation id`() {
        val ivanProfileId = createProfileWithUser(
            firstName = "Ivan",
            lastName = "Parvanovski",
            email = "ivan.findprivate@example.com"
        )

        val aliceProfileId = createProfileWithUser(
            firstName = "Alice",
            lastName = "Smith",
            email = "alice.findprivate@example.com"
        )

        val conversationId = ConversationService.createConversation(isGroup = false)

        addParticipant(conversationId, ivanProfileId)
        addParticipant(conversationId, aliceProfileId)

        val foundId = ConversationService.findPrivateConversation(
            user1 = ivanProfileId,
            user2 = aliceProfileId
        )

        assertEquals(conversationId, foundId)
    }

    @Test
    fun `findPrivateConversation returns null when only group conversation exists`() {
        val ivanProfileId = createProfileWithUser(
            firstName = "Ivan",
            lastName = "Parvanovski",
            email = "ivan.onlygroup@example.com"
        )

        val aliceProfileId = createProfileWithUser(
            firstName = "Alice",
            lastName = "Smith",
            email = "alice.onlygroup@example.com"
        )

        val conversationId = ConversationService.createConversation(isGroup = true)

        addParticipant(conversationId, ivanProfileId)
        addParticipant(conversationId, aliceProfileId)

        val foundId = ConversationService.findPrivateConversation(
            user1 = ivanProfileId,
            user2 = aliceProfileId
        )

        assertNull(foundId)
    }

    @Test
    fun `findPrivateConversation returns null when private conversation has extra participant`() {
        val ivanProfileId = createProfileWithUser(
            firstName = "Ivan",
            lastName = "Parvanovski",
            email = "ivan.extra@example.com"
        )

        val aliceProfileId = createProfileWithUser(
            firstName = "Alice",
            lastName = "Smith",
            email = "alice.extra@example.com"
        )

        val bobProfileId = createProfileWithUser(
            firstName = "Bob",
            lastName = "Jones",
            email = "bob.extra@example.com"
        )

        val conversationId = ConversationService.createConversation(isGroup = false)

        addParticipant(conversationId, ivanProfileId)
        addParticipant(conversationId, aliceProfileId)
        addParticipant(conversationId, bobProfileId)

        val foundId = ConversationService.findPrivateConversation(
            user1 = ivanProfileId,
            user2 = aliceProfileId
        )

        assertNull(foundId)
    }
}