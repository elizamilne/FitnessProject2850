package org.fitnessapp.services

import org.fitnessapp.models.Conversation
import org.fitnessapp.models.ConversationParticipant
import org.fitnessapp.models.Profile
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class ConversationParticipantServiceTest {

    @BeforeEach
    fun setup() {
        Database.connect(
            url = "jdbc:h2:mem:conversation_participant_test;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1",
            driver = "org.h2.Driver"
        )

        transaction {
            SchemaUtils.drop(
                ConversationParticipant,
                Conversation,
                Profile
            )

            SchemaUtils.create(
                Conversation,
                Profile,
                ConversationParticipant
            )

            // Allows testing without creating real Profile rows first.
            exec("SET REFERENTIAL_INTEGRITY FALSE")
        }
    }

    @Test
    fun `addParticipant adds profile to conversation`() {
        ConversationParticipantService.addParticipant(
            conversationId = 1L,
            profileId = 10L
        )

        val rows = transaction {
            ConversationParticipant.selectAll().toList()
        }

        assertEquals(1, rows.size)
        assertEquals(1L, rows.first()[ConversationParticipant.conversationId])
        assertEquals(10L, rows.first()[ConversationParticipant.profileId])
    }

    @Test
    fun `addParticipant does not duplicate existing participant`() {
        ConversationParticipantService.addParticipant(
            conversationId = 1L,
            profileId = 10L
        )

        ConversationParticipantService.addParticipant(
            conversationId = 1L,
            profileId = 10L
        )

        val rows = transaction {
            ConversationParticipant.selectAll().toList()
        }

        assertEquals(1, rows.size)
    }

    @Test
    fun `isUserInConversation returns true when profile is in conversation`() {
        ConversationParticipantService.addParticipant(
            conversationId = 1L,
            profileId = 10L
        )

        val result = ConversationParticipantService.isUserInConversation(
            profileId = 10L,
            conversationId = 1L
        )

        assertTrue(result)
    }

    @Test
    fun `isUserInConversation returns false when profile is not in conversation`() {
        ConversationParticipantService.addParticipant(
            conversationId = 1L,
            profileId = 10L
        )

        val result = ConversationParticipantService.isUserInConversation(
            profileId = 99L,
            conversationId = 1L
        )

        assertFalse(result)
    }

    @Test
    fun `isUserInConversation returns false when conversation does not exist`() {
        ConversationParticipantService.addParticipant(
            conversationId = 1L,
            profileId = 10L
        )

        val result = ConversationParticipantService.isUserInConversation(
            profileId = 10L,
            conversationId = 999L
        )

        assertFalse(result)
    }

    @Test
    fun `isUserInConversation checks exact profile and conversation pair`() {
        ConversationParticipantService.addParticipant(
            conversationId = 1L,
            profileId = 10L
        )

        ConversationParticipantService.addParticipant(
            conversationId = 2L,
            profileId = 20L
        )

        assertTrue(
            ConversationParticipantService.isUserInConversation(
                profileId = 10L,
                conversationId = 1L
            )
        )

        assertFalse(
            ConversationParticipantService.isUserInConversation(
                profileId = 10L,
                conversationId = 2L
            )
        )

        assertFalse(
            ConversationParticipantService.isUserInConversation(
                profileId = 20L,
                conversationId = 1L
            )
        )
    }
}