package com.isergeyam.battleship.controller;

import java.util.Hashtable;
import java.util.Optional;
import java.util.UUID;

import javax.validation.Valid;

import com.isergeyam.battleship.model.User;
import com.isergeyam.battleship.payload.LogInRequest;
import com.isergeyam.battleship.payload.LoginResponse;
import com.isergeyam.battleship.payload.SignUpRequest;
import com.isergeyam.battleship.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * LoginController
 */
@RestController()
@CrossOrigin
@RequestMapping("/api")
public class LoginController {
  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private Hashtable<String, User> currentlyLoggedUser;

  @PostMapping("/register")
  public ResponseEntity<?> registerNewUser(@Valid @RequestBody SignUpRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return new ResponseEntity<>(new ApiResponse<String>(false, "Username is already taken!"), HttpStatus.BAD_REQUEST);
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return new ResponseEntity<>(new ApiResponse<String>(false, "Email Address is already in use!"),
          HttpStatus.BAD_REQUEST);
    }

    User user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(),
        passwordEncoder.encode(signUpRequest.getPassword()));

    userRepository.save(user);

    return new ResponseEntity<>(new ApiResponse<String>(true, "User created successfully"), HttpStatus.OK);
  }

  @PostMapping("/login")
  public ResponseEntity<?> loginUser(@Valid @RequestBody LogInRequest logInRequest) {
    Optional<User> optuser = userRepository.findByEmail(logInRequest.getUserNameOrEmail());
    ResponseEntity<?> failResponse = ResponseEntity.badRequest()
        .body(new ApiResponse<LoginResponse>(false, "Invalid username or password", new LoginResponse()));
    if (!optuser.isPresent()) {
      optuser = userRepository.findByUsername(logInRequest.getUserNameOrEmail());
      if (!optuser.isPresent()) {
        return failResponse;
      }
    }
    User user = optuser.get();
    if (!passwordEncoder.matches(logInRequest.getPassword(), user.getPassword())) {
      return failResponse;
    }
    String uuid = UUID.randomUUID().toString();
    currentlyLoggedUser.put(uuid, user);
    return ResponseEntity.ok().body(new ApiResponse<LoginResponse>(true, "Successfull login",
        new LoginResponse(user.getUsername(), user.getEmail(), uuid)));
  }
}