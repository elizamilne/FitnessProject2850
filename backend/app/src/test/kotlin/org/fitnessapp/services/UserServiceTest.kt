package org.fitnessapp.services

import org.fitnessapp.models.CreateUserRequest
import org.fitnessapp.models.RegisterRequest
import org.fitnessapp.models.User
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class UserServiceTest {

    @BeforeEach
    fun setup() {
        Database.connect(
            url = "jdbc:h2:mem:user_test;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1;NON_KEYWORDS=USER",
            driver = "org.h2.Driver"
        )

        transaction {
            SchemaUtils.drop(User)
            SchemaUtils.create(User)
        }
    }

    @Test
    fun `toCreateUserRequest converts register request with hashed password`() {
        val registerRequest = RegisterRequest(
            firstName = "Ivan",
            lastName = "Parvanovski",
            email = "ivan@example.com",
            password = "plain-password"
        )

        val createUserRequest = registerRequest.toCreateUserRequest(
            hashedPassword = "hashed-password"
        )

        assertEquals("Ivan", createUserRequest.firstName)
        assertEquals("Parvanovski", createUserRequest.lastName)
        assertEquals("ivan@example.com", createUserRequest.email)
        assertEquals("hashed-password", createUserRequest.hashPass)
    }

    @Test
    fun `createActivityAndReturnId creates a user and returns its id`() {
        val request = CreateUserRequest(
            firstName = "Ivan",
            lastName = "Parvanovski",
            email = "ivan@example.com",
            hashPass = "hashed-password"
        )

        val id = UserService.createActivityAndReturnId(request)

        val user = requireNotNull(UserService.findUserById(id))

        assertEquals(id, user.id)
        assertEquals("Ivan", user.firstName)
        assertEquals("Parvanovski", user.lastName)
        assertEquals("ivan@example.com", user.email)
        assertTrue(user.createdAt.isNotBlank())
    }

    @Test
    fun `findUserById returns null when user does not exist`() {
        val user = UserService.findUserById(999L)

        assertNull(user)
    }

    @Test
    fun `findUserByEmail returns user row when email exists`() {
        val request = CreateUserRequest(
            firstName = "Ivan",
            lastName = "Parvanovski",
            email = "ivan@example.com",
            hashPass = "hashed-password"
        )

        val id = UserService.createActivityAndReturnId(request)

        val row = requireNotNull(UserService.findUserByEmail("ivan@example.com"))

        assertEquals(id, row[User.id])
        assertEquals("Ivan", row[User.firstName])
        assertEquals("Parvanovski", row[User.lastName])
        assertEquals("ivan@example.com", row[User.email])
        assertEquals("hashed-password", row[User.hashPass])
    }

    @Test
    fun `findUserByEmail returns null when email does not exist`() {
        val row = UserService.findUserByEmail("missing@example.com")

        assertNull(row)
    }

    @Test
    fun `toUserResponse converts result row to user response`() {
        val id = UserService.createActivityAndReturnId(
            CreateUserRequest(
                firstName = "Alice",
                lastName = "Smith",
                email = "alice@example.com",
                hashPass = "hashed-password"
            )
        )

        val row = requireNotNull(UserService.findUserByEmail("alice@example.com"))
        val response = row.toUserResponse()

        assertEquals(id, response.id)
        assertEquals("Alice", response.firstName)
        assertEquals("Smith", response.lastName)
        assertEquals("alice@example.com", response.email)
        assertTrue(response.createdAt.isNotBlank())
    }
}