package com.isergeyam.battleship.controller;

import java.util.ArrayList;
import java.util.Hashtable;
import java.util.Optional;

import javax.validation.Valid;

import com.isergeyam.battleship.model.User;
import com.isergeyam.battleship.payload.StatsResponse;
import com.isergeyam.battleship.payload.TokenRequest;
import com.isergeyam.battleship.repository.GameRepository;
import com.isergeyam.battleship.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * StatsController
 */
@RestController()
@CrossOrigin
@RequestMapping("/api")
public class StatsController {
  @Autowired
  private Hashtable<String, User> currentlyLoggedUser;

  @Autowired
  private GameRepository gameRepository;

  @Autowired
  private UserRepository userRepository;

  @PostMapping("/stats")
  public ResponseEntity<?> getUserStats(@Valid @RequestBody TokenRequest tokenRequest) {
    String token = tokenRequest.getToken();
    if (!currentlyLoggedUser.containsKey(token)) {
      return new ResponseEntity<>(new ApiResponse<>(false, "Unathorized", new StatsResponse()),
          HttpStatus.UNAUTHORIZED);
    }
    User user = currentlyLoggedUser.get(token);

    ArrayList<ArrayList<Integer>> last_games = new ArrayList<ArrayList<Integer>>(
        gameRepository.findLastGames(user.getId()));
    // ArrayList<Game> last_games = new ArrayList<Game>();
    ArrayList<String> winners = new ArrayList<String>();
    ArrayList<String> losers = new ArrayList<String>();
    last_games.forEach((game) -> {
      winners.add(userRepository.findById(game.get(0)).get().getUsername());
      losers.add(userRepository.findById(game.get(1)).get().getUsername());
    });
    Optional<Long> winrate = userRepository.getUserWinrate(user.getId());
    return ResponseEntity.ok().body(new ApiResponse<>(true, "Stats collected", new StatsResponse(
      winrate.isPresent() ? winrate.get() :  Long.valueOf(0), winners, losers)));
  }

}