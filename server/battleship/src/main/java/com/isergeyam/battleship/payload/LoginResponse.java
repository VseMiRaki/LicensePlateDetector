package com.isergeyam.battleship.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * LoginResponse
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LoginResponse {
  private String username;
  private String email;
  private String token;
}