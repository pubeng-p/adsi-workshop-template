package com.example.attendance.auth;

import com.example.attendance.employee.EmployeeResponse;

public record LoginResponse(
        String token,
        EmployeeResponse employee
) {}
