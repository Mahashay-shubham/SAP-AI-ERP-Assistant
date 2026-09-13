package com.erpassistant.service;

import org.springframework.stereotype.Service;

import com.erpassistant.model.Role;
import com.erpassistant.model.User;
import com.erpassistant.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User updateUserRole(Long userId, Role newRole) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Prevent removing the last ADMIN
        if (user.getRole() == Role.ADMIN && newRole != Role.ADMIN) {

            long adminCount = userRepository.countByRole(Role.ADMIN);

            if (adminCount <= 1) {
                throw new RuntimeException(
                        "Cannot change the role of the last ADMIN"
                );
            }
        }

        user.setRole(newRole);

        return userRepository.save(user);
    }
}