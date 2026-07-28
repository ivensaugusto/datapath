using System.Text;
using DataPath.Infrastructure.Storage;
using Xunit;

namespace DataPath.Tests;

public class StorageProviderTests
{
    [Fact]
    public async Task LocalFileSystemDriver_Save_Read_Delete_Flow_Succeeds()
    {
        // Arrange
        var tempFolder = Path.Combine(Path.GetTempPath(), "dataPath_Test_Storage_" + Guid.NewGuid());
        var driver = new LocalFileSystemDriver(tempFolder);
        var testContent = "WSI Fake File Content For Unit Testing";
        var fileName = "test_slide_01.svs";
        var folderPath = "cases/DP-2026-TEST";

        try
        {
            // Act - Save
            using var stream = new MemoryStream(Encoding.UTF8.GetBytes(testContent));
            var savedPath = await driver.SaveFileAsync(stream, fileName, folderPath);

            // Assert - Save
            Assert.True(File.Exists(savedPath));

            // Act - Read
            using var readStream = await driver.GetFileStreamAsync(savedPath);
            Assert.NotNull(readStream);
            using var reader = new StreamReader(readStream!);
            var readText = await reader.ReadToEndAsync();

            // Assert - Read
            Assert.Equal(testContent, readText);

            // Act - Temporary Link
            var shareLink = await driver.GenerateTemporaryShareLinkAsync(savedPath, 1);
            Assert.NotNull(shareLink);
            Assert.Contains("/api/files/shared/", shareLink);

            // Act - Delete
            var deleted = await driver.DeleteFileAsync(savedPath);
            Assert.True(deleted);
            Assert.False(File.Exists(savedPath));
        }
        finally
        {
            if (Directory.Exists(tempFolder))
            {
                Directory.Delete(tempFolder, recursive: true);
            }
        }
    }
}
