document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start-button');
    const audio = document.getElementById('bg-music');

    startButton.addEventListener('click', function () {
        document.getElementById('start-container').style.display = 'none';
        document.getElementById('loader').style.display = 'flex';

        audio.play().catch(function (error) {
            console.log("El audio debe ser reproducido por una interacción del usuario debido a las políticas del navegador.");
        });

        const animationContainer = document.getElementById('animation-container');
        const anim = lottie.loadAnimation({
            container: animationContainer,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: 'animations/cigueña2.json' // Ruta a tu archivo JSON de animación
        });

        anim.addEventListener('complete', function () {
            document.getElementById('loader').style.display = 'none';
            document.getElementById('content').style.display = 'block';
        });

        // Función para sincronizar el tiempo con un servidor NTP
        async function getNetworkTime() {
            try {
                const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC');
                const data = await response.json();
                return new Date(data.utc_datetime);
            } catch (error) {
                console.error('Error fetching time:', error);
                return new Date(); // Fallback to local time
            }
        }

        const countdownTimer = document.getElementById('countdown-timer');
        const eventDate = new Date('August 17, 2024 17:00:00').getTime();

        getNetworkTime().then(networkTime => {
            const countdownInterval = setInterval(function () {
                const now = networkTime.getTime() + Date.now() - networkTime.getTime();
                const distance = eventDate - now;

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                countdownTimer.innerHTML = `
                    <div class="countdown-container">
                        <div class="countdown-box"><p>${days}</p><p>días</p></div>
                        <div class="countdown-box"><p>${hours}</p><p>hrs</p></div>
                        <div class="countdown-box"><p>${minutes}</p><p>min</p></div>
                        <div class="countdown-box"><p>${seconds}</p><p>seg</p></div>
                    </div>
                `;

                if (distance < 0) {
                    clearInterval(countdownInterval);
                    countdownTimer.innerHTML = "<div class='countdown-container'><p>¡El evento ha comenzado!</p></div>";
                }
            }, 1000);
        });
    });

    // Agregar eventos touchstart para compatibilidad con dispositivos táctiles
    const areas = document.querySelectorAll('area');
    areas.forEach(area => {
        area.addEventListener('touchstart', function () {
            window.location.href = area.href;
        });
    });
});
