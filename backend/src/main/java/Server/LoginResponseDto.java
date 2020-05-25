package Server;

public class LoginResponseDto {

    public final boolean success;
    public final String error;
    public final boolean isManager;

    public LoginResponseDto(boolean success, String error, boolean isManager) {
        this.success = success;
        this.error = error;
        this.isManager = isManager;
    }
}
