package com.hanki.backend.enums;

public enum JwtConstants {
    ACCESS_TOKEN("access_token"),
    REFRESH_TOKEN("refresh_token");

    private final String value;

    JwtConstants(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
