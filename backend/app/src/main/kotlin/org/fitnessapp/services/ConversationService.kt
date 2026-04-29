package org.fitnessapp.services

import org.fitnessapp.models.Conversation
import org.fitnessapp.models.ConversationParticipant

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.insertAndGetId
import org.jetbrains.exposed.sql.transactions.transaction
import org.fitnessapp.models.ConversationDTO

import org.fitnessapp.services.UserService

object ConversationService {
    fun getUserConversations(profileId: Long, type: String?): List<ConversationDTO> {
        return transaction {

            val baseQuery = (Conversation innerJoin ConversationParticipant)
                .selectAll()
                .where { ConversationParticipant.profileId eq profileId }

            val filteredQuery = when (type) {
                "group" -> baseQuery.andWhere { Conversation.isGroup eq true }
                "chat"  -> baseQuery.andWhere { Conversation.isGroup eq false }
                else    -> baseQuery
            }

            filteredQuery.map { row ->
                val conversationId = row[Conversation.id]
                val isGroup = row[Conversation.isGroup]

               val name = if (isGroup) {
                    "Group #$conversationId"
               } else {
                    val participants = ConversationParticipant
                        .selectAll()
                        .where { ConversationParticipant.conversationId eq conversationId }
                        .map { it[ConversationParticipant.profileId] }

                    val otherProfileId = participants.first { it != profileId }

                    val otherProfile = ProfileService.getProfileById(otherProfileId)
                        ?: return@map ConversationDTO(
                            conversationId = conversationId,
                            name = "Unknown user",
                            isGroup = isGroup
                        )

                    val user = UserService.findUserById(otherProfile.userId)
                        ?: return@map ConversationDTO(
                            conversationId = conversationId,
                            name = "Unknown user",
                            isGroup = isGroup
                        )

                    "${user.firstName} ${user.lastName}"
                }

                ConversationDTO(
                    conversationId = conversationId,
                    name = name,
                    isGroup = isGroup
                )
            }
        }
    }

    fun getUserConversation(profileId: Long, conversationId: Long): ConversationDTO {
        return transaction {

            val row = (Conversation innerJoin ConversationParticipant)
                .selectAll()
                .where {
                    (ConversationParticipant.profileId eq profileId) and
                    (Conversation.id eq conversationId)
                }
                .singleOrNull()
                ?: throw IllegalArgumentException("Conversation not found or not accessible")

            val isGroup = row[Conversation.isGroup]

            val name = if (isGroup) {
                "Group #$conversationId"
            } else {
                val participants = ConversationParticipant
                    .selectAll()
                    .where { ConversationParticipant.conversationId eq conversationId }
                    .map { it[ConversationParticipant.profileId] }

                val otherProfileId = participants.firstOrNull { it != profileId }

                if (otherProfileId == null) {
                    "Unknown user"
                } else {
                    val otherProfile = ProfileService.getProfileById(otherProfileId)
                    val user = otherProfile?.let { UserService.findUserById(it.userId) }

                    user?.let { "${it.firstName} ${it.lastName}" } ?: "Unknown user"
                }
            }

            ConversationDTO(
                conversationId = conversationId,
                name = name,
                isGroup = isGroup
            )
        }
    }

    fun findPrivateConversation(user1: Long, user2: Long): Long? {
        return transaction {
            val rows = ConversationParticipant
                .selectAll()
                .where {
                    (ConversationParticipant.profileId eq user1) or
                    (ConversationParticipant.profileId eq user2)
                }
                .toList()

            val grouped = rows.groupBy {
                it[ConversationParticipant.conversationId] 
            }

            grouped.entries.firstOrNull { entry ->
                val users = entry.value.map {
                    it[ConversationParticipant.profileId] 
                }.toSet()

                users.containsAll(listOf(user1, user2))
            }?.key
        }
    }

    fun createConversation(isGroup: Boolean = false): Long {
        return transaction {
            Conversation.insert {
                it[Conversation.isGroup] = isGroup
            } get Conversation.id
        }
    }
}