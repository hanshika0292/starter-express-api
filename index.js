const express = require('express');
const http = require('http');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js')
const app = express();

const server = http.createServer(app);

//dev
// const io = require('socket.io')(server, {
//     cors: {
//         origin: "http://localhost:8080",  // your client origin
//         methods: ["GET", "POST"]
//     }
// });
// prod
const io = require('socket.io')(server, {
    cors: {
        origin: "https://bank-bailout-banter-ezbwmbq41-hanshika02.vercel.app",  // your client origin
        methods: ["GET", "POST"]
    }
});


app.use(cors());

const supabaseUrl = 'https://duadkawsxdmtozpesmyr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1YWRrYXdzeGRtdG96cGVzbXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM5ODkxNzcsImV4cCI6MjAwOTU2NTE3N30.csGIdFBWJGlRjiXazSWA_kButOU_o1kxEuEwTItENK0'

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    persistSession: false,
});

let gameState = {};

io.on('connection', (socket) => {

    socket.on('joinRoom', async (roomID) => {
        // Fetch the room data from the database
        const { data, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('id', roomID);

        if (error) {
            console.error('Error fetching room data:', error);
            return;
        }
        // else{
        //     console.log("With data-", data);
        //     return;
        // }

        io.emit('roomJoined', data);
        socket.join(roomID);
    });

    socket.on('getPlayerData', async ([player_id1, player_id2]) => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .in('id', [player_id1, player_id2]);

        if (error) {
            console.error('Error fetching room data:', error);
            return;
        }
        // else {
            // console.log("With data-", data);
        // }

        io.emit('playerData', data);
        socket.join([player_id1, player_id2]);
    })

    // Listen for the 'updateGameState' event from the client
    socket.on('updateGameState', async ({roomID, player1Investment, player2Investment, player1SP, player2SP, winner, currentBank, round, endGame, phaseMessage, gameStarted}) => {
        // console.log('Received updateGameState event with data:', data);

        // // Update the game state based on the action
        // switch (data.action) {
        //     case 'startGame':
        //         gameState = data.state;
        //         break;
        //     case 'resolveInvestment':
        //         gameState = data.state;
        //         break;
        //     // Add more cases as needed for other actions
        // }
        // Insert the new game state into the 'moves' table
        // const { gameStateData, error } = await supabase
        //     .from('moves')
        //     .insert([
        //         {
        //             room_id: data["state"]["roomID"],
        //             player_id: data["state"]["selectedPlayer"],
        //             move_data: JSON.stringify(data["state"]),
        //         }
        //     ]).select();

        // if (error) {
        //     console.error('Error inserting game state:', error);
        //     return;
        // } else {
        //     console.log("Successfully added gamestate - ", gameStateData)
        // }

        const gameState = {
            player1Investment,
            player2Investment,
            player1SP,
            player2SP,
            winner,
            currentBank,
            round,
            endGame,
            phaseMessage,
            gameStarted
        };
        console.log(gameState);
        // Emit the 'updateGameState' event to all connected clients with the new game state
        io.to(roomID).emit('gameStateUpdated', gameState);
    });

    socket.on('selectPlayer', ([roomID, playerID]) => {
        // Emit an event to update the room state
        io.to(roomID).emit('playerSelected', { playerID });
    });

    // Server side
    socket.on('playerMove', ({ roomID, player }) => {
        io.to(roomID).emit('playerMoveNotification', `${player} has made a move!`);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

});

server.listen(4000, () => {
    console.log('Server listening on port 4000');
});
