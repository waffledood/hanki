package com.hanki.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hanki.backend.dto.DeckPostDto;
import com.hanki.backend.model.Deck;
import com.hanki.backend.service.DeckService;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "spring.profiles.active=test")
@AutoConfigureMockMvc
public class DeckControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Mock
    private DeckService deckService;

    @Test
    public void testGetAllDecks() throws Exception {
        mockMvc.perform(get("/decks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testGetDeckById() throws Exception {
        // Create mock Deck
        int existingDeckId = 1;
        Deck mockDeck = new Deck();
        mockDeck.setId(existingDeckId);
        mockDeck.setName("Mock Deck Name");
        mockDeck.setDescription("Mock Deck Description");

        // Mock the service method to return the mock Deck created
        when(deckService.findById(existingDeckId)).thenReturn(Optional.of(mockDeck));

        mockMvc.perform(get("/decks/" + existingDeckId))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetDeckByIdNotFound() throws Exception {
        // Define a non existent Deck id
        int nonExistentDeckId = 99;

        mockMvc.perform(get("/decks/" + nonExistentDeckId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Deck not found with id: " + nonExistentDeckId));
    }

    @Test
    public void testPostDeck() throws Exception {
        // Initialize your DeckDto with necessary values for the test
        DeckPostDto deckDto = new DeckPostDto();
        deckDto.setName("Test Deck");
        deckDto.setDescription("Test Description");

        // Convert the DTO to JSON
        String deckJson = objectMapper.writeValueAsString(deckDto);

        // Perform POST request
        MvcResult result = mockMvc.perform(post("/decks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(deckJson))
                .andExpect(status().isCreated())  // Expect HTTP 201 Created status
                .andReturn();

        // Optionally, you can assert response content
        String responseContent = result.getResponse().getContentAsString();
        // You can verify the returned values (for example, the name or ID of the created deck)
        assertTrue(responseContent.contains("Test Deck"));
    }
}
