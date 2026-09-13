package com.erpassistant.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erpassistant.dto.RoleUpdateRequest;
import com.erpassistant.service.UserService;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<String> updateUserRole(
            @PathVariable Long userId,
            @RequestBody RoleUpdateRequest request) {

        userService.updateUserRole(
                userId,
                request.getRole()
        );

        return ResponseEntity.ok(
                "User role updated successfully"
        );
    }

    @PutMapping("/{userId}/name")
    public ResponseEntity<String> updateUserName(
            @PathVariable Long userId,
            @RequestBody java.util.Map<String, String> request) {

        userService.updateUserName(
                userId,
                request.get("name")
        );

        return ResponseEntity.ok(
                "User name updated successfully"
        );
    }
}