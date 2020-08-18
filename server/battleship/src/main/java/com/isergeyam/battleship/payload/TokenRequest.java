package com.isergeyam.battleship.payload;

import lombok.Getter;
import lombok.Setter;

/**
 * TokenRequest
 */
@Getter
@Setter
public class TokenRequest {
  private String token;
  public TokenRequest(String token, String another_field) {
    this.token = token;
  }
}