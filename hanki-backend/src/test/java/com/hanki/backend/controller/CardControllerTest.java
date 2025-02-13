package com.hanki.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hanki.backend.dto.CardPostDto;
import com.hanki.backend.model.Card;
import com.hanki.backend.model.Deck;
import com.hanki.backend.service.CardService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "spring.profiles.active=test")
@AutoConfigureMockMvc
public class CardControllerTest {
    @Autowired
    MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
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

    @Test
    public void testPostCard() throws Exception {
        // Define sample values of created Card
        String frontText = "Sample front text 1";
        String backText = "Sample back text 1";
        Integer deckId = 10;

        // Initialize your CardDto with necessary values for the test
        CardPostDto cardDto = new CardPostDto();
        cardDto.setFrontText(frontText);
        cardDto.setBackText(backText);
        cardDto.setDeckId(deckId);

        // Mock the behavior of the CardService
        Card card = new Card();
        card.setFrontText(frontText);
        card.setBackText(backText);
        card.setDeck(new Deck()); // empty Deck

        // When the saveDeck method is called, return the mock Card
        Mockito.when(cardService.createCard(Mockito.any(CardPostDto.class))).thenReturn(card);

        // Convert the DTO to JSON
        String cardJson = objectMapper.writeValueAsString(cardDto);

        // Perform POST request
        MvcResult result = mockMvc.perform(post("/cards")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(cardJson))
                .andExpect(status().isCreated())  // Expect HTTP 201 Created status
                .andReturn();

        // Optionally, you can assert response content
        String responseContent = result.getResponse().getContentAsString();
        // You can verify the returned values (for example, the name or ID of the created deck)
        assertTrue(responseContent.contains("Sample front text 1"));
    }
}
