package org.fitnessapp.routes

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.request.receive
import io.ktor.http.HttpStatusCode

import org.fitnessapp.services.ConversationService
import org.fitnessapp.services.ConversationParticipantService
import org.fitnessapp.models.StartChatRequest
import org.fitnessapp.models.CreateGroupRequest

fun Route.conversationRoutes() {

    route("/conversation") {
        get("/user/{profileId}") {
            val profileId = call.parameters["profileId"]?.toLongOrNull()
                ?: return@get call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to "Invalid profileId")
                )

            val type = call.request.queryParameters["type"] // nullable

            val conversations = ConversationService.getUserConversations(profileId, type)

            call.respond(HttpStatusCode.OK, conversations)
        }

        get("/{conversationId}") {
            val conversationId = call.parameters["conversationId"]?.toLongOrNull()
                ?: return@get call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to "Invalid conversationId")
                )

            val profileId = call.request.queryParameters["profileId"]?.toLongOrNull()
                ?: return@get call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to "Missing profileId")
                )

            try {
                val conversation = ConversationService.getUserConversation(profileId, conversationId)
                call.respond(HttpStatusCode.OK, conversation)
            } catch (e: IllegalArgumentException) {
                call.respond(
                    HttpStatusCode.NotFound,
                    mapOf("error" to e.message)
                )
            }
        }

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