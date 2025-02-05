package com.hanki.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class DeckControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetAllDecks() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/decks"))
                .andExpect(status().isOk());
    }
}
