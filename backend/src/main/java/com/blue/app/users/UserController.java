package com.blue.app.users;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.blue.app.users.dto.ProfileResponse;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/users")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile endpoints")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> profile(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(new ProfileResponse(user.getId(), user.getName(), user.getEmail()));
    }

    @GetMapping
    public Page<ProfileResponse> listUsers(
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20, sort = "name", direction = Direction.ASC) Pageable pageable) {

        String pattern = (search == null || search.isBlank()) ? "" : search;
        return userRepository.findByNameOrEmailContaining(pattern, pageable)
                .map(u -> new ProfileResponse(u.getId(), u.getName(), u.getEmail()));
    }

}