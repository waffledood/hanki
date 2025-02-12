package com.hanki.backend.controller;

import com.hanki.backend.model.Card;
import com.hanki.backend.model.Deck;
import com.hanki.backend.service.CardService;
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

@SpringBootTest(properties = "spring.profiles.active=test")
@AutoConfigureMockMvc
public class CardControllerTest {
    @Autowired
    MockMvc mockMvc;

    @Mock
    private CardService cardService;

    @Test
    public void testGetAllCards() throws Exception {
        mockMvc.perform(get("/cards"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testGetCardById() throws Exception {
        // Create mock Deck
        int existingCardId = 1;
        Card mockCard = new Card();
        mockCard.setId(existingCardId);
        mockCard.setFrontText("Mock Front Text");
        mockCard.setBackText("Mock Back Text");
        mockCard.setDeck(new Deck());

        // Mock the service method to return the mock Card created
        when(cardService.findById(existingCardId)).thenReturn(Optional.of(mockCard));

        mockMvc.perform(get("/cards/" + existingCardId))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetCardByIdNotFound() throws Exception {
        // Define a non-existent Card id
        int nonExistentCardId = 99;

        mockMvc.perform(get("/cards/" + nonExistentCardId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Card not found with id: " + nonExistentCardId));
    }
}
