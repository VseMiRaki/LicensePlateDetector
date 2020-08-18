package com.isergeyam.battleship.controller;

import java.util.ArrayList;

import com.isergeyam.battleship.repository.UserRepository;
import com.isergeyam.battleship.payload.Top10PlayerResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * TopPlayerController
 */
@RestController()
@CrossOrigin
@RequestMapping("/api")
public class Top10PlayersController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/top")
    public ResponseEntity<?> getTop10Players() {
        Top10PlayerResponse response = new Top10PlayerResponse(new ArrayList<>(userRepository.findTopPlayers()),
                new ArrayList<>(userRepository.findTopResults()));

        return ResponseEntity.ok().body(response);
    }

}