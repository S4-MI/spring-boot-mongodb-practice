package com.blue.app.users;

import com.blue.app.users.dto.ProfileResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Current user profile")
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> profile(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(new ProfileResponse(user.getId(), user.getName(), user.getEmail()));
    }
}