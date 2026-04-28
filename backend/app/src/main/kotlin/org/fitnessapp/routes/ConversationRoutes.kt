package org.fitnessapp.routes

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.request.receive

import org.fitnessapp.services.ConversationService
import org.fitnessapp.services.ConversationParticipantService
import org.fitnessapp.models.StartChatRequest
import org.fitnessapp.models.CreateGroupRequest

fun Route.conversationRoutes() {

    route("/conversation") {

        post("/private") {

            val request = call.receive<StartChatRequest>()

            val existing = ConversationService.findPrivateConversation(
                request.user1,
                request.user2
            )

            val conversationId = existing ?: run {
                val newId = ConversationService.createConversation(false)

                ConversationParticipantService.addParticipant(newId, request.user1)
                ConversationParticipantService.addParticipant(newId, request.user2)

                newId
            }

            call.respond(mapOf("conversationId" to conversationId))
        }

        post("/group") {
            val request = call.receive<CreateGroupRequest>()

            val conversationId = ConversationService.createConversation(true)

            request.participants.forEach { userId ->
                ConversationParticipantService.addParticipant(conversationId, userId)
            }

            call.respond(mapOf("conversationId" to conversationId))
        }
    }
}