package com.blue.app.auth;

import com.blue.app.auth.dto.AuthResponse;
import com.blue.app.exception.EmailAlreadyInUseException;
import com.blue.app.exception.InvalidTokenException;
import com.blue.app.exception.ResourceNotFound;
import com.blue.app.security.JwtService;
import com.blue.app.users.User;
import com.blue.app.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(String name, String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyInUseException(email);
        }

        User user = User.builder().name(name).email(email).password(passwordEncoder.encode(password)).build();
        userRepository.save(user);

        return issueToken(user);
    }

    public AuthResponse login(String email, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFound("User", email));
        return issueToken(user);
    }

    public AuthResponse refresh(String refreshToken) {
        String email;
        try {
            email = jwtService.extractUsername(refreshToken);
        } catch (Exception e) {
            throw new InvalidTokenException();
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidTokenException::new);

        if (!jwtService.isTokenValid(refreshToken, user)) {
            throw new InvalidTokenException();
        }

        return issueToken(user);
    }

    private AuthResponse issueToken(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        return new AuthResponse(accessToken, refreshToken);
    }
}
