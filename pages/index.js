import {ConnectWallet, useAddress, useContract, useContractRead, Web3Button} from "@thirdweb-dev/react";
import {
    Container,
    Flex,
    Text,
    Button,
    Spacer,
    ButtonGroup,
    SimpleGrid,
    Box,
    Card,
    CardBody,
    Skeleton,
    Input, Stack, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";


export default function Home() {
    const address = useAddress()
    const contractAddress = "0x4e05eD05a89018fc7bcF17Eac5F30dd083a620A7";

    const {contract} = useContract(contractAddress);

    const { data: counterData, isLoading: counterIsLoading } = useContractRead(contract, "counter");

    const [gameID, setGameID] = useState("");
    const [gameETH, setGameETH] = useState("");
    const [betgameID, setBetID] = useState("");
    const [betETH, setBetETH] = useState("");

    const [value, setValue] = useState(1)
    const handleChange = (value) => setValue(value)

    const { data: gameInfoData, isLoading: gameInfoIsLoading } = useContractRead(contract, "getGameInfo", [value]);

    const startDate = new Date(gameInfoData && gameInfoData[3] !== undefined ? ethers.utils.formatUnits(gameInfoData[3], 0) * 1000 : "Loading");
    const periodDate = new Date(gameInfoData && gameInfoData[4] !== undefined ? ethers.utils.formatUnits(gameInfoData[4], 0) * 1000 : "Loading");



    const handleIDStartChange = (event) => {
        setGameID(event.target.value)
    }

    const handleETHStartChange = (event) => {
        setGameETH(event.target.value)
    }

    const handleIDBetChange = (event) => {
        setBetID(event.target.value)
    }

    const handleETHBetChange = (event) => {
        setBetETH(event.target.value)
    }

    function clearValues() {
        setID("");
        setETH("");
    }

  return (
    <Container maxW={'1300'} w={"full"}>
        <Flex justifyContent={"space-between"} alignItems={"center"} py={"30px"} height={"100px"}>
            <Text fontSize='4xl' fontWeight={"bold"}>Bank Game</Text>
            <Flex direction={"row"} mt={"10px"}>
                <Text ml={"30px"}>Total Games: </Text>
                <Skeleton isLoaded={!counterIsLoading} width={"20px"}>
                {counterData?.toString()}
                </Skeleton>
            </Flex>
            <Spacer />
            <ButtonGroup variant='outline' spacing='6' p={"50px"}>
                <Button colorScheme='black'>History</Button>
                <Button colorScheme='black'>Help</Button>
            </ButtonGroup>
            <ConnectWallet />
        </Flex>
        <SimpleGrid columns={2} spacing={5}>
            <Box>
                <Card maxH={"60vh"}>
                    <Text fontSize='3xl' fontWeight={"bold"} align="center" mt={"20px"}>Create Game</Text>
                    <CardBody>
                        <Text fontSize={"2xl"} py={"10px"}>Game Number: </Text>
                        <Input placeholder="1" maxLength={6} value={gameID} onChange={handleIDStartChange}></Input>
                        <Text fontSize={"2xl"} mt={"10px"} py={"10px"}>Start price: </Text>
                        <Input placeholder="0.001" maxLength={8} value={gameETH} onChange={handleETHStartChange}></Input>

                        <Box mt={"20px"}>
                            {address ? (
                                <Web3Button
                                    contractAddress = {contractAddress}
                                    action={(contract) => {
                                        contract.call("startGame", [gameID], {value: ethers.utils.parseEther(gameETH)})
                                    }}
                                    onSuccess={() => clearValues()}
                                >{"Start the game with an initial bet"}</Web3Button>
                            ) : (
                                <Text>Connect you wallet to interract</Text>
                            )}

                        </Box>
                    </CardBody>
                </Card>
            </Box>
            <Box >
                <Card maxH={"60vh"}>
                    <Text fontSize='3xl' fontWeight={"bold"} align="center" mt={"20px"}>Bet</Text>
                    <CardBody>
                        <Text fontSize={"2xl"} py={"10px"}>Game Number: </Text>
                        <Input placeholder="1" maxLength={6} value={betgameID} onChange={handleIDBetChange}></Input>
                        <Text fontSize={"2xl"} mt={"10px"} py={"10px"}>Start price: </Text>
                        <Input placeholder="0.001" maxLength={8} value={betETH} onChange={handleETHBetChange}></Input>

                        <Box mt={"20px"}  >
                            {address ? (
                                <Web3Button
                                    contractAddress = {contractAddress}
                                    action={(contract) => {
                                        contract.call("Bet", [betgameID], {value: ethers.utils.parseEther(betETH)})
                                    }}
                                    onSuccess={() => clearValues()}
                                >{"BET"}</Web3Button>
                            ) : (
                                <Text>Connect you wallet to interract</Text>
                            )}
                        </Box>
                    </CardBody>
                </Card>
            </Box>
        </SimpleGrid>
            <Box px={"200px"} pt={"30px"}>
                <NumberInput step={1} defaultValue={1} min={1} onChange={handleChange}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <Card mt={"20px"}>
                    <Text fontSize='3xl' fontWeight={"bold"} align="center">Game {value}</Text>
                    <Flex>
                        <Text fontSize='1xl' pl={"10px"}>Started:</Text>
                        <Skeleton isLoaded={!gameInfoIsLoading} width={"100px"} ml={"5px"}>
                            {gameInfoData && gameInfoData[0] !== undefined ? (gameInfoData[0] ? "Game started" : "Not started") : "Loading..."}
                        </Skeleton>
                    </Flex>
                    <Flex>
                         <Text fontSize='1xl' pl={"10px"}>Winner now:</Text>
                        <Skeleton isLoaded={!gameInfoIsLoading} width={"500px"} ml={"5px"}>
                            {gameInfoData && gameInfoData[1] !== undefined ? gameInfoData[1] : "Loading..."}
                        </Skeleton>
                    </Flex>
                    <Flex>
                        <Text fontSize='1xl' pl={"10px"}>Bank:</Text>
                        <Skeleton isLoaded={!gameInfoIsLoading} width={"500px"} ml={"5px"}>
                            {gameInfoData && gameInfoData[2] !== undefined ? ethers.utils.formatEther(gameInfoData[2]) + "ETH" : "Loading..."}
                        </Skeleton>
                    </Flex>
                    <Flex>
                        <Text fontSize='1xl' pl={"10px"}>maxBet:</Text>
                        <Skeleton isLoaded={!gameInfoIsLoading} width={"500px"} ml={"5px"}>
                            {gameInfoData && gameInfoData[5] !== undefined ? ethers.utils.formatEther(gameInfoData[5]) + "ETH" : "Loading..."}
                        </Skeleton>
                    </Flex>
                    <Flex>
                        <Text fontSize='1xl' pl={"10px"}>Start Time:</Text>
                        <Skeleton isLoaded={!gameInfoIsLoading} width={"500px"} ml={"5px"}>
                            {gameInfoData && gameInfoData[3] !== undefined ? startDate.toLocaleString() : "Loading..."}
                        </Skeleton>
                    </Flex>
                    <Flex>
                        <Text fontSize='1xl' pl={"10px"}>Peroid:</Text>
                        <Skeleton isLoaded={!gameInfoIsLoading} width={"500px"} ml={"5px"}>
                            {gameInfoData && gameInfoData[4] !== undefined ? periodDate.getMinutes() + " minutes" : "Loading..."}
                        </Skeleton>
                    </Flex>
                    <Box mt={"20px"} p={"10px"} alignItems='center' display='flex' >
                        {address ? (
                            <Web3Button
                                contractAddress = {contractAddress}
                                action={(contract) => {
                                    contract.call("winthrdraw", [value])
                                }}
                            >{"Withdraw prizes from the game " + value}</Web3Button>
                        ) : (
                            <Text>Connect you wallet to interract</Text>
                        )}
                    </Box>
                </Card>
            </Box>


    </Container>
  );
}
