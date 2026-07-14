package com.example.attendance.auth;

import com.example.attendance.employee.Employee;
import com.example.attendance.employee.EmployeeRepository;
import com.example.attendance.employee.EmployeeResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public AuthServiceImpl(EmployeeRepository employeeRepository,
                           PasswordEncoder passwordEncoder,
                           JwtProvider jwtProvider) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        Employee employee = employeeRepository.findByLoginId(request.loginId())
                .orElseThrow(() -> new AuthenticationException("ユーザー名またはパスワードが正しくありません"));

        if (!passwordEncoder.matches(request.password(), employee.getPassword())) {
            throw new AuthenticationException("ユーザー名またはパスワードが正しくありません");
        }

        String token = jwtProvider.generateToken(
                employee.getId(),
                employee.getLoginId(),
                employee.getRole().name()
        );

        return new LoginResponse(token, EmployeeResponse.from(employee));
    }
}
