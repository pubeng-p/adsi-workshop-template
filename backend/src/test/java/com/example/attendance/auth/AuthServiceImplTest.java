package com.example.attendance.auth;

import com.example.attendance.employee.Employee;
import com.example.attendance.employee.EmployeeRepository;
import com.example.attendance.employee.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtProvider jwtProvider;

    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        authService = new AuthServiceImpl(employeeRepository, passwordEncoder, jwtProvider);
    }

    @Test
    @DisplayName("正しい認証情報でログインするとトークンが返される")
    void login_validCredentials_returnsToken() {
        // Arrange
        var employee = Employee.builder()
                .id(1L)
                .loginId("tanaka")
                .password("encoded")
                .name("田中太郎")
                .role(Role.EMPLOYEE)
                .build();
        when(employeeRepository.findByLoginId("tanaka")).thenReturn(Optional.of(employee));
        when(passwordEncoder.matches("password123", "encoded")).thenReturn(true);
        when(jwtProvider.generateToken(1L, "tanaka", "EMPLOYEE")).thenReturn("jwt-token");

        // Act
        LoginResponse response = authService.login(new LoginRequest("tanaka", "password123"));

        // Assert
        assertThat(response.token()).isEqualTo("jwt-token");
        assertThat(response.employee().name()).isEqualTo("田中太郎");
    }

    @Test
    @DisplayName("パスワードが間違っている場合は例外が投げられる")
    void login_invalidPassword_throwsException() {
        // Arrange
        var employee = Employee.builder()
                .id(1L)
                .loginId("tanaka")
                .password("encoded")
                .name("田中太郎")
                .role(Role.EMPLOYEE)
                .build();
        when(employeeRepository.findByLoginId("tanaka")).thenReturn(Optional.of(employee));
        when(passwordEncoder.matches("wrong", "encoded")).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> authService.login(new LoginRequest("tanaka", "wrong")))
                .isInstanceOf(AuthenticationException.class)
                .hasMessage("ユーザー名またはパスワードが正しくありません");
    }

    @Test
    @DisplayName("存在しないユーザーの場合は例外が投げられる")
    void login_unknownUser_throwsException() {
        // Arrange
        when(employeeRepository.findByLoginId("unknown")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> authService.login(new LoginRequest("unknown", "pass")))
                .isInstanceOf(AuthenticationException.class)
                .hasMessage("ユーザー名またはパスワードが正しくありません");
    }
}
