package com.hanki.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hanki.backend.dto.DeckPostDto;
import com.hanki.backend.model.Deck;
import com.hanki.backend.model.User;
import com.hanki.backend.repository.UserRepository;
import com.hanki.backend.service.DeckService;
import com.hanki.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "spring.profiles.active=test")
@AutoConfigureMockMvc
public class DeckControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private DeckService deckService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    public void setupUser() {
        if (userRepository.findByUsername("testuser") == null) {
            User user = new User();
            user.setUsername("testuser");
            user.setEmail("test@email.com");
            user.setPassword(userService.getEncoder().encode("password"));
            user.setRole("USER");
            userRepository.save(user);
        }
    }

    @Test
    @WithMockUser
    public void testGetAllDecks() throws Exception {
        mockMvc.perform(get("/decks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testGetAllDecksWithNoAuth() throws Exception {
        mockMvc.perform(get("/decks"))
                // 401 error
                .andExpect(status().is4xxClientError());
    }

    @Test
    @WithMockUser
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
    public void testGetDeckByIdWithNoAuth() throws Exception {
        // Create mock Deck
        int existingDeckId = 1;
        Deck mockDeck = new Deck();
        mockDeck.setId(existingDeckId);
        mockDeck.setName("Mock Deck Name");
        mockDeck.setDescription("Mock Deck Description");

        // Mock the service method to return the mock Deck created
        when(deckService.findById(existingDeckId)).thenReturn(Optional.of(mockDeck));

        mockMvc.perform(get("/decks/" + existingDeckId))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @WithMockUser
    public void testGetDeckByIdNotFound() throws Exception {
        // Define a non existent Deck id
        int nonExistentDeckId = 99;

        mockMvc.perform(get("/decks/" + nonExistentDeckId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Deck not found with id: " + nonExistentDeckId));
    }

    @Test
    @WithUserDetails(value = "testuser", userDetailsServiceBeanName = "HankiUserDetailsService")
    public void testPostDeck() throws Exception {
        // Initialize your DeckDto with necessary values for the test
        DeckPostDto deckDto = new DeckPostDto();
        deckDto.setName("Test Deck");
        deckDto.setDescription("Test Description");

        // Convert the DTO to JSON
        String deckJson = objectMapper.writeValueAsString(deckDto);

        // Perform POST request
        mockMvc.perform(post("/decks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(deckJson))
                        .andExpect(status().isCreated());  // Expect HTTP 201 Created status
    }

    @Test
    public void testPostDeckWithNoAuth() throws Exception {
        // Initialize your DeckDto with necessary values for the test
        DeckPostDto deckDto = new DeckPostDto();
        deckDto.setName("Test Deck");
        deckDto.setDescription("Test Description");

        // Mock the behavior of the DeckService
        Deck deck = new Deck();
        deck.setId(1);  // Set a mock ID for the created deck
        deck.setName("Test Deck");
        deck.setDescription("Test Description");

        // Convert the DTO to JSON
        String deckJson = objectMapper.writeValueAsString(deckDto);

        // Perform POST request
        mockMvc
                .perform(post("/decks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(deckJson))
                .andExpect(status().is4xxClientError());
    }
}
