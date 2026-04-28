package org.fitnessapp.services

import org.fitnessapp.models.ConversationParticipant
import org.jetbrains.exposed.sql.insertIgnore
import org.jetbrains.exposed.sql.transactions.transaction

object ConversationParticipantService {
    fun addParticipant(conversationId: Long, profileId: Long) {
        transaction {
            ConversationParticipant.insertIgnore {
                it[ConversationParticipant.conversationId] = conversationId
                it[ConversationParticipant.profileId] = profileId
            }
        }
    }
}