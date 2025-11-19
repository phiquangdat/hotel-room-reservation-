package com.team_seven.hotel_reservation_system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
<<<<<<<< HEAD:backend/src/main/java/com/team_seven/hotel_reservation_system/dto/AuthResponse.java
public class AuthResponse {
    private String token;
    private String email;
    private String firstName;
}
========
public class LoginRequest {
    private String email;
    private String password;
}
>>>>>>>> e7b56d9 (feat(auth): implement login page with redirect and error handling):backend/src/main/java/com/team_seven/hotel_reservation_system/dto/LoginRequest.java
