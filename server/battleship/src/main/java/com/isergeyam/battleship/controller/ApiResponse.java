package com.isergeyam.battleship.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by rajeevkumarsingh on 19/08/17.
 */
@Getter
@Setter
@AllArgsConstructor
public class ApiResponse<T> {
  private Boolean ok;
  private String message;
  private T data;

  public ApiResponse(Boolean ok, String message) {
    this.ok = ok;
    this.message = message;
  }
}
