package com.plan_it_urban.plan_it_urban.Model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class User {
    private int userId;
    private String username;
    private String password;
    private String role;
}
