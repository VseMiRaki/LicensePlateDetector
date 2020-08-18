package com.isergeyam.battleship.payload;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * SignUpRequest
 */
@Getter
@Setter
@AllArgsConstructor
public class SignUpRequest {
  @NotBlank
  private String username;

  @NotBlank
  @Email
  private String email;

  @NotBlank
  private String password;
}