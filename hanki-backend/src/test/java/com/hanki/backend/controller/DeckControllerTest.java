package com.hanki.backend.controller;

import com.hanki.backend.model.Deck;
import com.hanki.backend.service.DeckService;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class DeckControllerTest {

    @Autowired
    private MockMvc mockMvc;

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
                .andExpect(status().isNotFound());
    }
}
