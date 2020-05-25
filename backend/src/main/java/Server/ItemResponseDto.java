package Server;

public class ItemResponseDto {
    public final boolean success;
    public final String error;

    public ItemResponseDto(boolean success, String error) {
        this.success = success;
        this.error = error;
    }
}
